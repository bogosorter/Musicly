import { Play, Pause, SkipFwd, SkipBwd, Fullscreen, Line, Close } from '../Icons/Icons';
import Button from '../Button/Button';
import Cover from '../Cover/Cover';
import Shortcuts from 'renderer/Shortcuts/Shortcuts';

import Evts from 'renderer/Events/Events';
import emptyCover from '../../../../assets/empty.png';
import { useReducer, useState, useCallback, useEffect } from 'react';
import './miniplayer.css';

/**
 * Renders a mini-player view, with the ability to return to normal, play,
 * pause, skip forward and skip backward. Should also display cover and current
 * track name. A close button should change the view back to the library and
 * minimize.
 */
export default function MiniPlayer({playback, dummy = false}) {

    // Instead of manually changing all actions, it is best to just inutilize
    // events. Cover shouldn't fire events if this is a test or if parent is
    // control area.
    let Events;
    if (dummy) Events = { fire: () => null, on: () => null };
    else Events = Evts;

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    Events.on('play', forceUpdate);
    Events.on('pause', forceUpdate);

    const size = window.settings.miniPlayerSize.value;
    const sizeFactor = size == 'small'? 0.6 : size == 'medium'? 0.75 : 1;
    let controllButtons = [
        { onClick: () => Events.fire('skipBwd'), content: <SkipBwd size={32 * sizeFactor} /> },
        playback.playing()? { onClick: () => Events.fire('pause'), content: <Pause size={32 * sizeFactor} />, shortcuts: [' '] } :
        { onClick: () => Events.fire('play'), content: <Play size={32 * sizeFactor} />, shortcuts: [' ']},
        { onClick: () => Events.fire('skipFwd'), content: <SkipFwd size={32 * sizeFactor} /> },
        { onClick: () => Events.fire('changeView', 'library'), content: <Fullscreen size={20 * sizeFactor}/>, shortcuts: ['escape', 'alt+leftarrow']},
        { onClick: () => {
            Events.fire('changeView', 'library');
            Events.fire('windowButton', 'minimize');
        }, content: <Close size={32 * sizeFactor}/>},
    ];

    controllButtons = controllButtons.map((button, index) => {
        return <Button onClick={button.onClick} key={index} shortcuts={button.shortcuts} size={60 * sizeFactor}>{button.content}</Button>;
    });

    // If the current album doesn't have a defined cover, use an empty one as
    // background image
    let backgroundImage = `url(${emptyCover})`;
    if (playback.album && playback.album.coverPath) {
        backgroundImage = `url('file://${playback.album.coverPath}')`;
        // Ensure that the path is escaped: this is needed for Windows paths.
        // For some reason, backgroundImage = backgroundImage.replace('\\',
        // '\\\\') does'n work. Therefore, we have to change the backslashes to
        // forward ones.
        backgroundImage = backgroundImage.replace(/\\/g, '/');
    }

    return (
        <div id='mini-player'>
            <div id='mini-player-cover'>
                <Cover album={playback.album} parent='miniplayer' />
            </div>
            <div id='mini-player-content' style={{'--bg-image': backgroundImage}}>
                <div id='mini-player-track-title'><h4 style={{fontSize: `calc((1.275rem + 0.3vw) * ${sizeFactor})`}}>{limitTitle(playback.track?.title)}</h4></div>
                <div id='mini-player-buttons'>
                    {controllButtons}
                </div>
            </div>
        </div>
    )
}

// Limits title to a fixed number of characters
const LIMIT = 25;
function limitTitle(title = '') {
    let temp = title.substring(0, LIMIT);
    temp.trim();
    if (title.length > LIMIT) temp += '...';
    return temp;
}