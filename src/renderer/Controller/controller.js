import PlaybackManager from './playbackmanager';
import StateManager from './statemanager';

export default class Controller {
    constructor(setView, setPlayback, setLoading, setTheme, setTutorial) {
        this.playback = new PlaybackManager(setPlayback);
        this.stateManager = new StateManager(setView, setLoading, setTheme, setTutorial);
    }
}