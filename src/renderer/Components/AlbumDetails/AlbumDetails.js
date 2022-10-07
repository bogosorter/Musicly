import Header from '../Header/Header';
import Cover from '../Cover/Cover';
import ControllArea from '../ControllArea/ControllArea';
import TrackList from '../TrackList/TrackList';
import Genre from '../Genre/Genre';
import GenreCreator from '../GenreCreator/GenreCreator';

import Events from 'renderer/Events/Events';
import { useMemo, useState } from 'react';
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
            <div className='d-flex' key={renderedInfo.length}><h5>{key}:</h5>{info[key]}</div>
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
                <div className='col-lg-3 col-sm-4'>
                    <Cover album={details.album} buttons={['play']} parent={'albumDetails'} />
                    <div className='spacer-8' />
                    {renderedInfo}
                </div>
                <div id='album-tracks' className='col-lg-8 col-sm-7'>
                    <TrackList tracks={details.tracks} playback={playback} parent='albumDetails'/>
                </div>
            </div>
            
            <ControllArea playback={playback} />
        </div>
    )
}