import Cover from '../Cover/Cover';
import ControllArea from '../ControllArea/ControllArea';
import SearchBox from '../SearchBox/SearchBox';
import Header from '../Header/Header';
import { Plus } from '../Icons/Icons';

import Events from 'renderer/Events/Events';
import { useState, useMemo, useEffect } from 'react';
import { nanoid } from 'nanoid';
import TrackList from '../TrackList/TrackList';
import './library.css';
import Button from '../Button/Button';

/**
 * Component rendered inside the `App`, displaying an album's details such as
 * cover, `TrackList` and artist. Also has a `ControllArea`. Accepts
 * `playback` as property.
 * @param {Object} properties 
 */
export default function Library({playback}) {

    // Info about what should be displayed in the library component
    const [library, setLibrary] = useState({
        searchParameters: {
            query: '',
            genre: ''
        },
        albums: [], // Array of albums that match the search parameters
        tracks: [], // Array of tracks that match the search parameters
        genres: [] // Array of all genres in library 
    });

    // Pass setLibrary to the controller
    useMemo(() => Events.fire('getLibrary', {query: '', genre: ''}, setLibrary), []);

    let albums = library.albums.map(album => {
        const title = limitTitle(album.title);
        return <div className='col-xxl-2 col-lg-3 col-md-4 col-sm-6 p-xxl-2 p-3' key={nanoid()}>
            <Cover album={album} buttons={['play', 'details']} parent={'library'} updateParent={setLibrary}/>
            <div className='spacer-8'></div>
            <h5 className='text-center'>{title}</h5>
        </div>;
    });
    // If no albums match the search parameters, display a button that allows
    // add more 
    if (albums.length  == 0) albums = <Button onClick={() => Events.fire('open', setLibrary)}><Plus /></Button>

    // Keep track of scrolling state
    useEffect(() => {
        document.querySelector('#library').scrollTo(0, window.scrollInLibrary);
    })
    function updateScroll() {
        window.scrollInLibrary = document.querySelector('#library').scrollTop;
    }

    return (
        <>
            <Header setLibrary={setLibrary} /><div className='header-placeholder' />
            <div className='spacer-24'/>
            <div id='library' onScroll={updateScroll}>
                <div className='row justify-content-center'>
                    <div className='col-11'>
                        <div className='d-flex center-children'>
                            <h1>Library:</h1>
                            <div className='w-100'></div>
                            <SearchBox searchParameters={library.searchParameters} genres={library.genres} setLibrary={setLibrary} />
                        </div>
                        <div className='spacer-48' />
                        <div className='row'>
                            {albums}
                        </div>
                        <TrackList tracks={library.tracks} playback={playback}/>
                        <div className='spacer-400' />
                    </div>
                </div>
            </div>
            <ControllArea playback={playback} />
        </>
    )
}

// Limits title to a fixed number of characters
const LIMIT = 20;
function limitTitle(title) {
    let temp = title.substring(0, 20);
    temp.trim();
    if (title.length > 20) temp += '...';
    return temp;
}