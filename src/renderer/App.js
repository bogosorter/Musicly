import Library from './Components/Library/Library';
import AlbumDetails from './Components/AlbumDetails/AlbumDetails';
import Queue from './Components/Queue/Queue';
import Settings from './Components/Settings/Settings';
import { ContextMenu } from './Components/ContextMenu/ContextMenu';
import SplashScreen from './Components/SplashScreen/SplashScreen';
import Tutorial from './Components/Tutorial/Tutorial';
import { Logger } from './Components/Logger/Logger';

import Controller from './Controller/controller';
import { useState, useMemo, useEffect } from 'react';
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

    // Info about what is playing and the queue
    const [playback, setPlayback] = useState({
        album: null, // Object that stores info about the playing album
        track: null, // Object that stores info about the playing track
        queue: [], // Array of tracks in queue
        position: 0, // Index of the playing track in queue
        progress: () => 0, // Returns a value between 0 and 1
        playing: () => false // Is playback playing or paused?
    });

    // Controlls whether a spinner should be shown
    const [loading, setLoading] = useState(false);

    // Controlls which class should be added to the App component
    const [theme, setTheme] = useState('dark');

    // Controlls whether a tutorial should be shown
    const [tutorial, setTutorial] = useState(false);

    const controller = useMemo(
        () => new Controller(setView, setPlayback, setLoading, setTheme, setTutorial),
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

    
    // If user is not active for 2 minutes, change view to the queue
    let timeoutID;
    // This function should be called when any movement is registered
    function inactivityTimeout() {
        if (view == 'queue') return;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            setView('queue');
        } , 120000);
    }
    useEffect(() => {
        // Register event listeners for keyboard and scrolling to activate timeout
        window.addEventListener('keydown', inactivityTimeout);
        window.addEventListener('scroll', inactivityTimeout, true);

        inactivityTimeout();

        return () => {
            window.removeEventListener('keydown', inactivityTimeout);
            window.removeEventListener('scroll', inactivityTimeout);
        }
    })

    return (
        <div id='app' className={'theme-' + theme}>
        {
            view == 'library'?
                <Library controller={controller} playback={playback} /> :
            view == 'albumDetails'?
                <AlbumDetails controller={controller} playback={playback} /> :
            view == 'queue'?
                <Queue controller={controller} playback={playback} /> :
                <Settings />
        }
            <ContextMenu />
            <Logger />
            {loadingDiv}
            {tutorial? <Tutorial setTutorial={setTutorial}/> : null}
            {splashScreenRendered}
        </div>
    );
}
