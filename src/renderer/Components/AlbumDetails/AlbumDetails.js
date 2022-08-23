import Header from '../Header/Header';
import Cover from '../Cover/Cover';
import ControllArea from '../ControllArea/ControllArea';
import TrackList from '../TrackList/TrackList';
import Genre from '../Genre/Genre';

import Events from 'renderer/Events/Events';
import { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import './albumdetails.css';

/**
 * Component rendered inside the `App`, displaying an album's details such as
 * cover, `TrackList` and artist. Also has a `ControllArea`. Accepts `playback`
 * as property.
 * @param {Object} properties 
 */
export default function AlbumDetails({playback}) {

    // Info about what should be displayed in the AlbumDetails component
    const [details, setDetails] = useState({
        album: {}, // Generic album info
        tracks: [], // List of album tracks
    });

    useMemo(() => Events.fire('getAlbumDetails', setDetails), []);

    const genres = details.album.genres?.map(genre =>
        <Genre genre={genre} key={nanoid()}/>
    );

    let info = {};
    if (details.album.artist) info['Artist'] = <p className='ms-4'>{details.album.artist}</p>;
    if (genres?.length != 0) info['Genres'] = <div id='genre-container'>{genres}</div>;

    let renderedInfo = [];
    for (const key in info) {
        renderedInfo.push(
            <div className='d-flex' key={nanoid()}><h5>{key}:</h5>{info[key]}</div>
        );
    }

    return (
        <div id='album-details'>
            <Header /><div className='header-placeholder' />

            <div className='spacer-48' />
            <div className='row justify-content-center'>
                <div className='col-11'><h1>{details.album.title}</h1></div>
            </div>
            <div className='row justify-content-center'>
                <div className='col-lg-3 col-sm-6'>
                    <Cover album={details.album} buttons={['play']} parent={'albumDetails'} updateParent={setDetails} />
                    <div className='spacer-8' />
                    {renderedInfo}
                </div>
                <div id='album-tracks' className='col-lg-8 col-sm-5'>
                    <TrackList tracks={details.tracks} playback={playback} displayCDs={true}/>
                </div>
            </div>
            
            <ControllArea playback={playback} />
        </div>
    )
}