import { Play, Pause, SkipFwd, SkipBwd, Fullscreen, Line, Close } from '../Icons/Icons';
import Button from '../Button/Button';
import Cover from '../Cover/Cover';
import Shortcuts from 'renderer/Shortcuts/Shortcuts';

import Events from 'renderer/Events/Events';
import { useReducer, useState, useCallback, useEffect } from 'react';
import './miniplayer.css';

/**
 * Renders a mini-player view, with the ability to return to normal, play,
 * pause, skip forward and skip backward. Should also display cover and current
 * track name. A close button should change the view back to the library and
 * minimize.
 */
export default function MiniPlayer({playback}) {

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
            Events.fire('windowButton', 'minimize');
            Events.fire('changeView', 'library');
        }, content: <Close size={32 * sizeFactor}/>},
    ];

    controllButtons = controllButtons.map((button, index) => {
        return <Button onClick={button.onClick} key={index} shortcuts={button.shortcuts} size={60 * sizeFactor}>{button.content}</Button>;
    });

    return (
        <div id='mini-player'>
            <div id='mini-player-cover'>
                <Cover album={playback.album} parent='miniplayer' />
            </div>
            <div id='mini-player-content'>
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