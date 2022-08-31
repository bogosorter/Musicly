import Library from './Components/Library/Library';
import AlbumDetails from './Components/AlbumDetails/AlbumDetails';
import Queue from './Components/Queue/Queue';
import Settings from './Components/Settings/Settings';
import { ContextMenu } from './Components/ContextMenu/ContextMenu';
import SplashScreen from './Components/SplashScreen/SplashScreen';
import Tutorial from './Components/Tutorial/Tutorial';
import Logger from './Components/Logger/Logger';

import Controller from './Controller/controller';
import { useState, useMemo, useEffect, useReducer } from 'react';
import 'bootstrap/scss/bootstrap.scss';
import './scss/spacers.scss';
import './App.css';

/**
 * This is the main component. It stores a series of states and renders four
 * views (`Library`, `Settings`, `AlbumDetails` and `Queue`) according to
 * `view`. It also renders a `ContextMenu`, a spinner if `loading` and a
 * `Tutorial` if `tutorial`.
 */
export default function App() {
    // The `App` component sets up four states: `view`, `playback`, `loading`,
    // and `theme`.

    const [view, setView] = useState('library');

    // Info about the user's library
    const [library, setLibrary] = useState({
        searchParameters: {
            query: '',
            genre: ''
        },
        albums: [], // Array of albums that match the search parameters
        tracks: [], // Array of tracks that match the search parameters
        genres: [] // Array of all genres in library 
    });

    // Info about what is playing and the queue
    const [playback, setPlayback] = useState({
        album: null, // Object that stores info about the playing album
        track: null, // Object that stores info about the playing track
        queue: [], // Array of tracks in queue
        position: 0, // Index of the playing track in queue
        progress: () => 0, // Returns a value between 0 and 1
        playing: () => false // Is playback playing or paused?
    });

    // Info about what should be displayed in the AlbumDetails component
    const [details, setDetails] = useState({
        album: {}, // Generic album info
        tracks: [], // List of album tracks
    });

    // Variable that stores current settings
    const [settings, setSettings] = useState({});
    window.settings = settings;

    // Logs that the user should see
    const [logs, addLog] = useReducer((state, message) => {
        // To reset the logs, use 'reset' as the message
        if (message === 'reset') {
            return [];
        }
        return [...state, message];
    }, []);

    // Controlls whether a spinner should be shown
    const [loading, setLoading] = useState(false);

    const controller = useMemo(
        () => new Controller(setView, setLibrary, setDetails, setSettings, setPlayback, setLoading, addLog),
        []
    );
    const loadingDiv = loading? (
        <div id='loading-div' className='center-children'>
            <div className='spinner-grow text-info'/>
        </div>
    ) : null;

    // Splash screen should only be loaded on the first call
    const [splashScreen, setSplashScreen] = useState(true);
    const splashScreenRendered = splashScreen? <SplashScreen setSplashScreen={setSplashScreen} /> : null;

    // If user becomes inactive, the que should be displayed. The inactive time
    // is set in settings.inactiveTimeout.value
    // Check if user is inactive
    // Called whenever there is a movement
    function activate() {
        clearTimeout(timeoutID);
        const time = settings.inactiveTime? settings.inactiveTime.value * 60000: 120000;
        timeoutID = setTimeout(() => setView('queue'), time);
    }

    // Set up event handlers for activate
    useEffect(() => {
        window.addEventListener('mousedown', activate);
        window.addEventListener('keypress', activate);
        window.addEventListener('scroll', activate, true);

        if (view != 'queue') activate();

        return () => {
            window.removeEventListener('mousedown', activate);
            window.removeEventListener('keypress', activate);
            window.removeEventListener('scroll', activate, true);
        }
    });

    return (
        <div id='app' className={'theme-' + (settings.theme? settings.theme.value : 'dark')}>
        {
            view == 'library'?
                <Library library={library} playback={playback} /> :
            view == 'albumDetails'?
                <AlbumDetails details={details} playback={playback} /> :
            view == 'queue'?
                <Queue playback={playback} /> :
                <Settings settings={settings} displayTutorial={() => setSettings({...settings, firstTime: true})}/>
        }
            <ContextMenu />
            <Logger messages={logs} reset={() => addLog('reset')}/>
            {loadingDiv}
            {settings.firstTime? <Tutorial dismissTutorial={() => setSettings({...settings, firstTime: false})}/> : null}
            {splashScreenRendered}
        </div>
    );
}

let timeoutID;