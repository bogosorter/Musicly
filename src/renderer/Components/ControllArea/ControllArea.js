import Button from '../Button/Button';
import Cover from '../Cover/Cover';
import ProgressBar from '../ProgressBar/ProgressBar';
import { SkipBackward, SkipForward, Play, Pause, Stop, MusicNoteList, Repeat, Repeat1 } from 'react-bootstrap-icons';

import Events from 'renderer/Events/Events';
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

    if (!playback.track) return null;

    // Since play state may be changed other methods than the buttons in
    // ControllArea (in `mediaSession`), we must listen to those events.
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    Events.on('play', forceUpdate);
    Events.on('pause', forceUpdate);

    // Buttons used to navigate through the queue and play/pause music
    const repeatButton = (
        <span className={`repeat-${playback.repeat}`}>
            {playback.repeat == 1? <Repeat1 size={24}/> : <Repeat size={24}/>}
        </span>
    );
    let controllButtons = [
        { onClick: () => Events.fire('skipBwd'), content: <SkipBackward size={30}/> },
        playback.playing()? { onClick: () => Events.fire('pause'), content: <Pause size={30}/>, shortcuts: [' '] } :
        { onClick: () => Events.fire('play'), content: <Play size={30}/>, shortcuts: [' ']},
        { onClick: () => Events.fire('skipFwd'), content: <SkipForward size={30}/> },
        { onClick: () => Events.fire('stop'), content: <Stop size={30}/>},
        { onClick: () => Events.fire('toggleRepeat'), content: repeatButton, shortcuts: ['ctrl-r', 'r']},
        { onClick: () => Events.fire('changeView', 'queue'), content: <MusicNoteList size={24}/>, shortcuts: ['ctrl+q', 'q']},
    ];
    controllButtons = controllButtons.map((button, index) => {
        return <Button onClick={button.onClick} key={index} shortcuts={button.shortcuts}>{button.content}</Button>;
    });

    // Add shortcuts for seeking
    useEffect(() => {
        Shortcuts.add(() => Events.fire('seekBwd'), 'arrowleft');
        Shortcuts.add(() => Events.fire('seekFwd'), 'arrowright');
        return () => Shortcuts.remove('arrowleft', 'arrowright');
    })

    return (
        <div id='control-area'>
            <div id='control-area-cover'>
                <Cover album={playback.album} parent='controllArea' />
            </div>
            <div id='control-panel'>
                <div id='control-panel-child-1' className='hide-if-not-active'>
                    <ProgressBar getProgress={playback.progress} dummy={dummy} />
                </div>
                <div id='control-panel-child-2'>
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