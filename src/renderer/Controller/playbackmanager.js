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
            playing: () => false // Is playback playing or paused?
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

        // Event listeners for `play`, `pause`, `skipFwd`, `skipBwd` and
        // `getTracks`
        Events.on('play', this.play.bind(this));
        Events.on('pause', this.pause.bind(this));
        Events.on('stop', this.stop.bind(this));
        Events.on('seekFwd', this.seekFwd.bind(this));
        Events.on('seekBwd', this.seekBwd.bind(this));
        Events.on('skipFwd', this.skipFwd.bind(this));
        Events.on('skipBwd', this.skipBwd.bind(this));
        Events.on('setProgress', this.setProgress.bind(this));
        Events.on('getTracks', this.getTracks.bind(this));

    }

    /**
     * Starts the playback of a new track, according to position.
     */
    async start() {

        // Ensure that previous howl is stopped
        if (this.howl) this.howl.unload();
        
        // Update playback information
        this.playback.track = this.playback.queue[this.playback.position];
        this.playback.album = await ipcRenderer.invoke('getAlbum', this.playback.track.albumID);

        // Create a howl with the new track
        this.howl = new Howl({
            src: ['file://' + this.playback.track.path],
            html5: true,
            onend: this.skipFwd.bind(this),
            // Setup mediaSession info. For some reason, this only works inside
            // the onplay callback
            onload: () => {
                // Listen for playback events
                navigator.mediaSession.setActionHandler('play', () => Events.fire('play'));
                navigator.mediaSession.setActionHandler('pause', () => Events.fire('pause'));
                navigator.mediaSession.setActionHandler('stop', () => Events.fire('stop'));
                navigator.mediaSession.setActionHandler('nexttrack', () => Events.fire('skipFwd'));
                navigator.mediaSession.setActionHandler('previoustrack', () => Events.fire('skipBwd'));

                // Play the track and update UI
                Events.fire('play');
            },
            onloaderror: (id, err) => {
                // Error code 4 indicates that track doesn't exist
                if (err == 4) {
                    Events.fire('log', `Track doesn\'t exist: ${this.playback.track.path}`);
                    this.skipFwd();
                }
            }
        });

        this.playback.playing = this.howl.playing;
        this.playback.progress = () => this.howl.seek() / this.howl.duration();

        // Get album cover if it exits
        const cover = this.getCover(this.playback.album.coverPath);

        // Setup media session metadata
        let metadata = {
            title: this.playback.track.title,
            album: this.playback.album.title,
            artist: this.playback.album.artist,
            artwork: cover? [{ src: cover }] : []
        };
        navigator.mediaSession.metadata = new MediaMetadata(metadata);

        // Block sleeping if view is queue
        ipcRenderer.invoke('blockSleep');

        this.updatePlayback();
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
        if (this.howl) this.howl.unload();
        // Reset the values of playback
        this.playback = {
            album: null,
            track: null,
            queue: [],
            position: 0,
            progress: () => 0,
            playing: () => false
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

        this.playback.position = Math.min(this.playback.queue.length, this.playback.position + 1);
        if (this.playback.position < this.playback.queue.length) this.start();
        // Unload howl, since this.start won't be called
        else {
            this.howl.unload();

            // Update playback
            this.playback.album = null;
            this.playback.track = null;
            this.playback.queue = [];
            this.playback.position = 0;
            this.playback.playing = () => false;
            this.playback.progress = () => 0;
            this.updatePlayback();

            ipcRenderer.invoke('unblockSleep');
        }
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
        const playing = this.playback.position != this.playback.queue.length;
        
        // If tracks is a single track, keep the ones in the queue
        if (tracks.length == 1) {
            this.playback.queue.splice(this.playback.position + 1, 0, tracks[0]);
        }
        // If there are more than one tracks, remove all tracks in the queue
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
        const playing = this.playback.position != this.playback.queue.length;
        this.playback.queue = this.playback.queue.concat(tracks);

        if (!playing) this.start();
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
        }
    }

    /**
     * Helper function for start. Gets the album cover in base 64. Based upon
     * implementation of martpie in museeks
     * @param {string} coverPath 
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
}