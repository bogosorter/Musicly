import Events from 'renderer/Events/Events';

/**
 * Class that controls what is playing, what will play next, what to pause, etc.
 */
export default class PlaybackManager {

    constructor(setPlayback) {

        // Initialize playback state to empty
        this.playback = {
            album: null, // Object that stores info about the playing album
            track: null, // Object that stores info about the playing track
            queue: [], // Array of tracks in queue
            position: 0, // Index of the playing track in queue
            progress: () => 0, // Returns a value between 0 and 1
            playing: () => false, // Is playback playing or paused?
            repeat: 0, // Can be set to 0 for no repeat, 1 for repeating the
                       // curent track once and 2 for constantly repeating the
                       // current track
        }

        /**
         * Updates the state of elements depending on playback.
         */
        this.updatePlayback = () => setPlayback({...this.playback});

        this.start.bind(this);
        this.play.bind(this);
        this.pause.bind(this);
        this.skipFwd.bind(this);
        this.skipBwd.bind(this);
        this.setProgress.bind(this);
        this.playTracks.bind(this);
        this.addNext.bind(this);
        this.addToQueue.bind(this);
        this.getTracks.bind(this);

        // Event listeners for `play`, `pause`, `skipFwd`, `skipBwd`,
        // `reorderQueue`, `removeFromQueue` and `getTracks`
        Events.on('play', this.play.bind(this));
        Events.on('pause', this.pause.bind(this));
        Events.on('stop', this.stop.bind(this));
        Events.on('seekFwd', this.seekFwd.bind(this));
        Events.on('seekBwd', this.seekBwd.bind(this));
        Events.on('skipFwd', this.skipFwd.bind(this));
        Events.on('skipBwd', this.skipBwd.bind(this));
        Events.on('setProgress', this.setProgress.bind(this));
        Events.on('reorderQueue', this.reorderQueue.bind(this));
        Events.on('removeFromQueue', this.removeFromQueue.bind(this));
        Events.on('getTracks', this.getTracks.bind(this));
        Events.on('toggleRepeat', this.toggleRepeat.bind(this));

    }

    /**
     * Starts the playback of a new track, according to position.
     */
    async start() {
        // Ensure that previous howl is stopped
        if (this.howl) this.howl.unload();
        this.howl = this.createHowl(this.playback.queue[this.playback.position]);
        this.howl.play();
    }

    /**
     * Continues the playback and emits an event notifying
     * the interested components.
     */
    play() {
        if (this.howl) {
            this.howl.play();
            ipcRenderer.invoke('blockSleep');
        }
    }

    /**
     * Stops the playback and emits an event notifying the
     * interested components.
     */
    pause() {
        if (this.howl) {
            this.howl.pause();
        }
        ipcRenderer.invoke('unblockSleep');
    }

    /**
     * Stops the playback and sets the properties of playback to their default
     * value.
     */
    stop() {
        if (this.howl) {
            this.howl.unload();
            this.howl = null;
        }
        // Reset the values of playback
        this.playback = {
            album: null,
            track: null,
            queue: [],
            position: 0,
            progress: () => 0,
            playing: () => false,
            repeat: 0
        }
        this.updatePlayback();
        ipcRenderer.invoke('unblockSleep');
    }

    /**
     * Advances playback 5 seconds.
     */
    seekFwd() {
        if (this.howl) this.howl.seek(this.howl.seek() + 5);
    }

    /**
     * Retards playback 5 seconds.
     */
    seekBwd() {
        if (this.howl) this.howl.seek(this.howl.seek() - 5);
    }

    /**
     * Increments position and plays the corresponding track. If all tracks in
     * queue were played, position is set to the queue's length.
     */
    skipFwd() {

        if (!this.howl) return;

        if (this.playback.repeat === 1) {
            this.howl.seek(0);
            this.howl.play();
            this.playback.repeat = 0;
            this.updatePlayback();
            return;
        }

        if (this.playback.repeat === 2) {
            this.howl.seek(0);
            this.howl.play();
            return;

        }
        
        if (this.playback.position + 1 < this.playback.queue.length) {
            this.playback.position = Math.min(this.playback.queue.length, this.playback.position + 1);
            this.start();
            return;
        }

        this.stop();
    }

    /**
     * If playing time is greater than 5 seconds, return to beginning of the
     * track. If this condition is not true, decrements position and plays the
     * corresponding track.
     */
    skipBwd() {

        if (!this.howl) return;

        if (this.howl.seek() > 5) {
            this.start();
            return;
        }

        this.playback.position = Math.max(0, this.playback.position - 1);
        this.start()
    }

    /**
     * Sets the music progress to the percentage given in the argument.
     */
    setProgress(progress) {
        this.howl.seek(progress * this.howl.duration());
    }

    /**
     * Immediately stops current playback and plays the supplied list of tracks.
     * Even when choosing the third track in a list, the user expects to be able
     * to go back to the second one. This is why `jump` is used: `tracks`
     * represents all the tracks and `jump` would be 2.
     */
    playTracks(tracks, jump) {
        // Remove next tracks from queue
        this.playback.queue = tracks
        this.playback.position = jump;

        this.start();
    }

    /**
     * Adds the supplied list of tracks to the queue, right next to the
     * currently playing one.
     */
    addNext(tracks) {
        // Is there any music playing?
        const playing = this.playback.position !== this.playback.queue.length;
        
        // If tracks is a single track, keep the ones in the queue
        if (tracks.length === 1) {
            this.playback.queue.splice(this.playback.position + 1, 0, tracks[0]);
        }
        // If there is more than one track, remove all tracks in the queue
        // after the currently playing one
        else {
            this.playback.queue.splice(this.playback.position + 1);
            this.playback.queue = this.playback.queue.concat(tracks);
        }
        
        if (!playing) this.start();
        else this.updatePlayback();
    }

    /**
     * Adds the supplied list of tracks to the end of the queue.
     */
    addToQueue(tracks) {
        // Is there any music playing?
        const playing = this.playback.position !== this.playback.queue.length;
        this.playback.queue = this.playback.queue.concat(tracks);

        if (!playing) this.start();
        else this.updatePlayback();
    }

    /**
     * Shuffles the tracks and plays the first one.
     */
    shuffle(tracks) {
        const shuffled = tracks.sort(() => Math.random() - 0.5);
        this.playTracks(shuffled, 0);
    }

    /**
     * Changes the position of one track in the queue. If this change affects
     * `playback.position`, its value should be updated.
     */
    reorderQueue(from, to) {
        const track = this.playback.queue[from];
        this.playback.queue.splice(from, 1);
        this.playback.queue.splice(to, 0, track);

        // Update playback position
        if (from < this.playback.position && to >= this.playback.position) this.playback.position--;
        else if (from > this.playback.position && to <= this.playback.position) this.playback.position++;
        else if (from === this.playback.position) this.playback.position = to;
        this.updatePlayback();
    }

    /**
     * Removes the track a `index` position of the queue. If this change affects
     * `playback.position`, its value should be updated.
     */
    removeFromQueue(index) {
        this.playback.queue.splice(index, 1);
        const isCurrentTrack = index === this.playback.position;
        // Update playback position
        if (index <= this.playback.position) this.playback.position--;
        
        if (isCurrentTrack) this.skipFwd();
        else this.updatePlayback();
    }

    /**
     * Gets tracks according to the sourceType (albumID, track,
     * tracks) and the detail (either an integer or a list of integers)
     * and forwards them to playTracks, addNext or addToQueue.
     */
    async getTracks(sourceType, detail, destination, jump = 0) {
        let tracks = [];
        switch(sourceType) {
            case 'albumID':
                tracks = await ipcRenderer.invoke('getAlbumTracks', detail);
                break;
            case 'track':
                tracks.push(detail);
                break;
            case 'tracks':
                tracks = tracks.concat(detail);
                break;
        }
        switch (destination) {
            case 'playTracks':
                this.playTracks(tracks, jump);
                break;
            case 'addNext':
                this.addNext(tracks);
                break;
            case 'addToQueue':
                this.addToQueue(tracks);
                break;
            case 'shuffle':
                this.shuffle(tracks);
                break;
        }
    }

    /**
     * Helper function for start. Gets the album cover in base 64. Based upon
     * implementation of martpie in museeks
     */
    getCover(coverPath) {
        if (!coverPath) return null;

        // To prevent cache of old images, cover paths are saved with the
        // current date in the query string, which conflicts with fs
        coverPath = coverPath.split('?')[0];

        const data = fs.readFileSync(coverPath, { encoding: 'base64' });
        const format = path.extname(coverPath).substr(1);
        return `data:${format};base64,${data}`;
    }

    /**
     * Changes the repeat option.
     */
    toggleRepeat() {
        this.playback.repeat = (this.playback.repeat + 1) % 3;
        this.updatePlayback();
    }

    createHowl(track) {
        // Create a howl with the new track
        const howl = new Howl({
            src: [`file://${track.path}`],
            html5: true,
            onend: this.skipFwd.bind(this),
            // Setup mediaSession info. For some reason, this only works inside
            // the onplay callback
            onplay: async () => {

                // For the remote possibility that someone is reading this, let
                // me say a couple words about mediaSession. I hate it. There is
                // almost no feedback. After a whole afternoon hunting for a
                // bug, I finally have the solution, but I don't know how it
                // works. Worse, I can't distinguish it from the previous
                // version. Therefore, do not touch the following code unless
                // you are ready for a lot of pain.

                // Update playback information
                this.playback.track = track;
                this.playback.album = await ipcRenderer.invoke('getAlbum', track.albumID);
                this.playback.playing = howl.playing;
                this.playback.progress = () => howl.seek() / howl.duration();

                // Listen for playback events
                navigator.mediaSession.setActionHandler('play', () => Events.fire('play'));
                navigator.mediaSession.setActionHandler('pause', () => Events.fire('pause'));
                navigator.mediaSession.setActionHandler('stop', () => Events.fire('stop'));
                navigator.mediaSession.setActionHandler('nexttrack', () => Events.fire('skipFwd'));
                navigator.mediaSession.setActionHandler('previoustrack', () => Events.fire('skipBwd'));

                // Get album cover if it exits
                const cover = this.getCover(this.playback.album.coverPath);

                // Setup media session metadata
                const metadata = {
                    title: this.playback.track.title,
                    album: this.playback.album.title,
                    artist: this.playback.album.artist,
                    artwork: cover? [{ src: cover }] : []
                };
                navigator.mediaSession.metadata = new MediaMetadata(metadata);

                this.updatePlayback();
            },
            onloaderror: (id, err) => {
                // Error code 4 indicates that track doesn't exist
                if (err === 4) {
                    Events.fire('log', {type: 'error', message: `Track doesn\'t exist: ${track.path}`});
                    this.stop();
                }
            }
        });
        return howl;
    }
}