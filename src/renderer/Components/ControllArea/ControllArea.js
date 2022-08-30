import Button from '../Button/Button';
import Cover from '../Cover/Cover';
import ProgressBar from '../ProgressBar/ProgressBar';
import { SkipBwd, SkipFwd, Play, Pause, Square, Queue } from '../Icons/Icons';

import Evts from 'renderer/Events/Events';
import { useReducer, useEffect } from 'react';
import './controllarea.css';
import Shortcuts from 'renderer/Shortcuts/Shortcuts';

/**
 * Component that displays information about the currently playing track (cover,
 * name and album), and allows to seek, pause, play, skip forward and skip
 * backward. Is called with the argument `playback`. An optional property
 * `dummy` prevents all events from being fired.
 */
export default function ControllArea({playback, dummy = false}) {

    // Instead of manually changing all actions, it is best to just inutilize
    // events.
    let Events;
    if (!dummy) Events = Evts;
    else Events = { fire: () => null, on: () => null };

    // Since play state may be changed other methods than the buttons in
    // ControllArea (in `mediaSession`), we must listen to those events.
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    Events.on('play', forceUpdate);
    Events.on('pause', forceUpdate);

    // Buttons used to navigate through the queue and play/pause music
    let controllButtons = [
        { onClick: () => Events.fire('skipBwd'), content: <SkipBwd /> },
        playback.playing()? { onClick: () => Events.fire('pause'), content: <Pause />, shortcuts: [' '] } :
        { onClick: () => Events.fire('play'), content: <Play />, shortcuts: [' ']},
        { onClick: () => Events.fire('skipFwd'), content: <SkipFwd /> },
        { onClick: () => Events.fire('stop'), content: <Square />},
        { onClick: () => Events.fire('changeView', 'queue'), content: <Queue size={24}/>, shortcuts: ['ctrl+q', 'q']},
    ];
    controllButtons = controllButtons.map((button, index) => {
        return <Button onClick={button.onClick} key={index} shortcuts={button.shortcuts}>{button.content}</Button>;
    });

    // Clicking in the album cover or track info should redirect user to the
    // queue
    function displayQueue() {
        if (playback.track) Events.fire('changeView', 'queue'); 
    }

    // Add shortcuts for seeking
    useEffect(() => {
        Shortcuts.add(() => { Events.fire('seekBwd'); forceUpdate(); }, 'arrowleft');
        Shortcuts.add(() => { Events.fire('seekFwd'); forceUpdate(); }, 'arrowright');
        return () => Shortcuts.remove('arrowleft', 'arrowright');
    })

    return (
        <div id='control-area'>
            <div id='control-area-cover' onClick={displayQueue}>
                <Cover album={playback.album} parent='controllArea' />
            </div>
            <div id='control-panel'>
                <div className='hide-if-not-active'>
                    <ProgressBar getProgress={playback.progress} dummy={dummy} />
                </div>
                <div>
                    <div id='track-details' className='w-100'>
                        <h3>{playback.track? playback.track.title : 'Nothing playing'}</h3>
                        <p>{playback.track? playback.album.title : null}</p>
                    </div>
                    <div id='control-area-buttons' className='col hide-if-not-active'>
                        {controllButtons}
                    </div>
                </div>
            </div>
        </div>
    )
}