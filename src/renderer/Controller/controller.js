import PlaybackManager from './playbackmanager';
import StateManager from './statemanager';

export default class Controller {
    constructor(setView, setLibrary, setAlbumDetails, setSettings, setPlayback, setLoading, addLog) {
        this.playback = new PlaybackManager(setPlayback);
        this.stateManager = new StateManager(setView, setLibrary, setAlbumDetails, setSettings, setPlayback, setLoading);
    }
}