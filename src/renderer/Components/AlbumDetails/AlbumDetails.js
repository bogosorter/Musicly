import Header from '../Header/Header';
import Cover from '../Cover/Cover';
import ControllArea from '../ControllArea/ControllArea';
import TrackList from '../TrackList/TrackList';
import Genre from '../Genre/Genre';
import GenreCreator from '../GenreCreator/GenreCreator';

import Events from 'renderer/Events/Events';
import { useMemo, useState } from 'react';
import getCover from '../Cover/getCover';
import './albumdetails.css';

/**
 * Component rendered inside the `App`, displaying an album's details such as
 * cover, `TrackList` and artist. Also has a `ControllArea`. Accepts `playback`
 * as property.
 * @param {Object} properties 
 */
export default function AlbumDetails({details, playback}) {

    const genres = details.album.genres?.map((genre, index) =>
        <Genre genre={genre} key={index} onClick={() => Events.fire('deleteGenre', genre, details.album.id)} deleteButton={true}/>
    );
    genres.push(
        <GenreCreator createGenre={(genre) => Events.fire('createGenre', genre, details.album.id)} key={genres.length}/>
    )

    let info = {};
    if (details.album.artist) info['Album Artist'] = <p className='ms-4'>{details.album.artist}</p>;
    if (genres?.length != 0) info['Genres'] = <div id='genre-container'>{genres}</div>;

    let renderedInfo = [];
    for (const key in info) {
        renderedInfo.push(
            <div className='d-flex align-items-center' key={renderedInfo.length}><h5>{key}:</h5>{info[key]}</div>
        );
    }

    const backgroundImage = getCover(details.album);
    }

    return (
        <div id='album-details'>
            <Header /><div className='header-placeholder' />

            <div id='album-details-scroll'>
                <div className='spacer-48' />
                <div className='row justify-content-center'>
                    <div className='col-11'>
                        <div id='album-details-background' className='row' style={{'--bg-image': backgroundImage}}>
                            <div className='col-lg-2 col-md-3 d-md-block d-none'>
                                <Cover album={details.album} buttons={['play']} parent='albumDetails' />
                            </div>
                            <div className='col-lg-10 col-md-9 col-12'>
                                <h1>{details.album.title}</h1>
                                <div className='spacer-8' />
                                {renderedInfo}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='spacer-48' />
                <div className='row justify-content-center'>
                    <div className='col-10'>
                        <TrackList tracks={details.tracks} playback={playback} parent='albumDetails'/>
                    </div>
                </div>

                <div className='spacer-100' />
            </div>
            <ControllArea playback={playback} />
        </div>
    )
}