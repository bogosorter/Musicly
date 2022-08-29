import Track from '../Track/Track';

import { CD } from '../Icons/Icons';
import { useReducer } from 'react';
import './tracklist.css';
import Events from 'renderer/Events/Events';

/**
 * Displays a list of tracks, accepting `tracks`, `playback` and `displayCDs`.
 * This last variable specifies whether a separator indicating a different CD
 * from the same album should be introduced.
 */
export default function TrackList({tracks, playback, parent}) {

    // Tracks should be updated when there is some change in play state.
    // Since play state may be changed in other methods than the buttons in
    // ControllArea (in `mediaSession`), we must listen to those events.
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    Events.on('play', forceUpdate);
    Events.on('pause', forceUpdate);

    const trackList = [];

    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const playing = playback.track && playback.playing() && ((parent !='queue' && playback.track.id == track.id) || (parent == 'queue' && i == playback.position));

        // If parent == albumDetails is true, tracks that belong to different
        // CDs should have a banner displaying it.
        if (track.trackOrder == 1 && parent == 'albumDetails') {
            trackList.push(
                <div className={`row disc-separator mb-4 ${track.disc > 1? 'mt-4' : ''}`} key={`discSeparator${i}`}>
                    <div className='col-1 center-children'><CD/></div>
                    <div className='col-1 d-flex align-items-center'>{track.disc}</div>
                </div>
            )
        }

        const classes = [];
        if (i == 0 || (track.trackOrder == 1 && parent == 'albumDetails')) classes.push('track-top');
        // If the next track has another disc number, a disk separator will be
        // put in place, so the track has to have the 'track-bottom' class
        if (i == tracks.length - 1 || (tracks[i + 1].disc != track.disc && parent == 'albumDetails')) classes.push('track-bottom');

        const tracksToPlay = tracks.slice(i);

        trackList.push(
            <Track track={track} classes={classes} playing={playing} tracksToPlay={tracksToPlay} key={i}/>
        )
    }

    return (
        <div id='track-list'>
            {trackList}
        </div>
    )
}
