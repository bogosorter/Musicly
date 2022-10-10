import Evts from 'renderer/Events/Events';
import { addContextMenu } from '../ContextMenu/ContextMenu';
import Button from '../Button/Button';
import { Close } from '../Icons/Icons';

import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import './track.css';

/**
 * Displays a single track. The component should display the track number and
 * name, and also a sprite if it is currently playing. `jump` and `tracks`
 * property specify which tracks should be played if this track is clicked (in
 * an album, for instance, you want the user to be able choose a track and play
 * all the ones that come after it). `parent` is the component that contains the
 * track, and if `parent == queue` a button allowing to remove the track from
 * the queue should be displayed. An optional property `dummy` should prevent
 * all events from being fired. It is used in the tutorial.
 */
export default function Track({track, classes, playing, tracks, jump, dummy = false, parent}) {

    // Instead of manually changing all actions, it is best to just inutilize
    // events.
    let Events;
    if (!dummy) Events = Evts;
    else Events = { fire: () => null };
    
    classes.push('row');
    classes.push('track');

    const actions = [
        { text: 'Play Track', onClick: () => Events.fire('getTracks', 'track', track, `playTracks`) },
        { text: 'Play Track Next', onClick: () => Events.fire('getTracks', 'track', track, `addNext`) },
        { text: 'Add Track to Queue', onClick: () => Events.fire('getTracks', 'track', track, `addToQueue`) },
        { text: 'Play Tracks', onClick: () => Events.fire('getTracks', 'tracks', tracks, `playTracks`, jump) },
        { text: 'Play Tracks next', onClick: () => Events.fire('getTracks', 'tracks', tracks, `addNext`) },
        { text: 'Add Tracks to Queue', onClick: () => Events.fire('getTracks', 'tracks', tracks, `addToQueue`) }
    ];

    const id = nanoid();
    useEffect(() => {
        let element = document.querySelector(`#track-${id}`)
        addContextMenu(element, actions);

        // If the track is playing and not a child of library or of inactive
        // queue, scroll to it.
        element = document.querySelector(`#track-${id}:not(#library #track-${id}, #queue.inactive #track-${id})`);
        if (playing && element) {
            setTimeout(() => element.scrollIntoView({behavior: 'smooth', block: 'center'}), 500);
        }
    });

    // Display close button if parent is queue
    const close = parent == 'queue'? <Button onClick={(e) => {
        Events.fire('removeFromQueue', jump);
        e.stopPropagation();
    }} type={'nodecor'}><Close size={20} /></Button> : null;

    return (
        <div id={`track-${id}`} className={classes.join(' ')} onClick={actions[3].onClick}>
            <div className='col-1 d-flex justify-content-center align-items-end'><PlayingBars playing={playing} /></div>
            <div className='col-1'>{track.trackOrder}</div>
            <div className='col-1'/>
            <div className='col-4'>{limitTitle(track.title)}</div>
            <div className='col-1'/>
            <div className='col-3'>{track.composer}</div>
            <div className='col-1 d-flex justify-content-end'>{close}</div>
        </div>
    )
}

/**
 * Sprite indicating that the track is playing
 */
function PlayingBars({playing}) {

    // If track is not playing, the sprite should not be shown
    if (!playing) return;

    return (
        <div id='playing-bars'>
            <div id='playing-bar-1' className='playing-bar'></div>
            <div id='playing-bar-2' className='playing-bar ms-1 me-1'></div>
            <div id='playing-bar-3' className='playing-bar'></div>
        </div>
    )
}

// Limits title to a fixed number of characters
const LIMIT = 50;
function limitTitle(title) {
    let temp = title.substring(0, LIMIT);
    temp.trim();
    if (title.length > LIMIT) temp += '...';
    return temp;
}