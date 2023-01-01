import Button from '../Button/Button';
import { Play, List } from 'react-bootstrap-icons';
import { addContextMenu } from '../ContextMenu/ContextMenu';

import getCover from './getCover';
import { useEffect } from 'react';
import Events from 'renderer/Events/Events';
import { nanoid } from 'nanoid';
import './cover.css';

/**
 * Component that displays an album cover, given an `album` object. Also accepts
 * an argument `buttons` (defaulting to `[]`) with a list of buttons to display
 * on cover (`play` for playing the album and `details` for a detailed album
 * view) and a `setLibrary` function, to pass as argument when album is deleted.
 * Right clicking on the album should bring up a context menu with the following
 * options: `playAlbum`, `addAlbumToQueue`, `albumDetail`, `addCover` and
 * `deleteAlbum`.
 */
export default function Cover ({album, buttons = [], parent}) {

    // Generate a unique ID for the cover
    const id = nanoid();
    
    // Actions that the user can trigger in the `ContextMenu`
    const actions = [
        { text: 'Play', onClick: () => Events.fire('getTracks', 'albumID', album.id, 'playTracks') },
        { text: 'Play Next', onClick: () => Events.fire('getTracks', 'albumID', album.id, 'addNext') },
        { text: 'Play Later', onClick: () => Events.fire('getTracks', 'albumID', album.id, 'addToQueue') },
        { text: 'Shuffle', onClick: () => Events.fire('getTracks', 'albumID', album.id, 'shuffle') },
        { text: 'Album Details', onClick: () => Events.fire('changeView', 'albumDetails', album.id) },
        { text: 'Add Cover', onClick: () => Events.fire('addCover', album.id, parent) }
    ];
    if (parent == 'library') {
        actions.push(
            { text: 'Delete from Library', onClick: () => Events.fire('deleteAlbum', album.id) }
        );
    }

    // You may notice that this code block and the following are inverted. We
    // should check if the album exists before adding a context menu, and we
    // could return an empty cover if it doesn't. However, React complains
    // because we are conditionally calling a hook.
    useEffect(() => {
        if (album) addContextMenu(document.querySelector(`#album-cover-${id}`), actions);
    })

    // An empty cover is returned if no album is selected
    if (!album) return (
        <div className='cover' style={{'--bg-image': getCover({})}} ></div>
    )

    const backgroundImage = getCover(album);

    const renderedButtons = [];
    if (buttons.includes('play')) {
        const onClick = (e) => {
            e.stopPropagation();
            actions[0].onClick();
        };
        renderedButtons.push(
            <Button onClick={onClick} type='round' key={renderedButtons.length}><Play size={30} /></Button>
        )
    }
    if (buttons.includes('details')) {
        renderedButtons.push(
            <div className='ms-4' key={renderedButtons.length}/>
        );
        const onClick = (e) => {
            e.stopPropagation();
            actions[4].onClick();
            console.log('details');
        };
        renderedButtons.push(
            <Button onClick={onClick} type='round' key={renderedButtons.length}><List size={30} /></Button>
        );
    }
    
    return (
        <div id={`album-cover-${id}`} className='cover center-children' style={{'--bg-image': backgroundImage}} onClick={parent != 'dummy'? actions[4].onClick : null}>
            {renderedButtons}
        </div>
    )
}