import Header from '../Header/Header';
import Cover from '../Cover/Cover';
import ControllArea from '../ControllArea/ControllArea';
import TrackList from '../TrackList/TrackList';
import Genre from '../Genre/Genre';
import GenreCreator from '../GenreCreator/GenreCreator';
import { Pencil, CheckLg, Shuffle } from 'react-bootstrap-icons';
import Button from '../Button/Button';

import Events from 'renderer/Events/Events';
import { useMemo, useState } from 'react';
import getCover from '../Cover/getCover';
import './albumdetails.css';

/**
 * Component rendered inside the `App`, displaying an album's details such as
 * cover, `TrackList` and artist. Also has a `ControllArea`. Accepts `playback`
 * as property.
 */
export default function AlbumDetails({details, playback}) {

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(details.album.title);
    const [artist, setArtist] = useState(details.album.artist);
    const [genres, setGenres] = useState(details.album.genres);

    function updateAlbumInfo() {
        Events.fire('updateAlbumInfo', details.album.id, {
            id: details.album.id,
            title,
            artist,
            genres,
            tracks: details.tracks,
        });
        setEditing(false);
    }

    function removeGenre (index) {
        genres.splice(index, 1);
        setGenres([...genres]);
    }
    function addGenre (genre) {
        setGenres([...genres, genre]);
    }

    let headerContent;
    if (!editing) {
        headerContent = (
            <>
                <div className='d-flex align-items-center'>
                    <h1>{details.album.title}</h1>
                    <h3 className='ms-4 artist-detail'>{details.album.artist}</h3>
                </div>
                <div className='d-flex mt-2'>{genres?.map((genre, index) =>
                    <Genre genre={genre} key={index}/>
                )}</div>
            </>
        );
    } else {
        headerContent = (
            <>
                <div className='d-flex'>
                    <div className='d-flex flex-column'>
                        <label for='title' className='detail-label'>Title</label>
                        <input id='title' className='detail-input' type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className='d-flex flex-column ms-4'>
                        <label for='artist' className='detail-label'>Artist</label>
                        <input id='artist' className='detail-input' type='text' placeholder='Artist' value={title} onChange={(e) => setArtist(e.target.value)} />
                    </div>
                </div>
                <label for='genres' className='detail-label mt-4'>Genres</label>
                <div id='genres' className='d-flex mt-2'>
                    {genres.map((genre, index) =>
                        <Genre genre={genre} key={index} onClick={() => removeGenre(index)} deleteButton={true}/>
                    )}
                    <GenreCreator createGenre={addGenre}/>
                </div>
            </>
        );
    }

    const backgroundImage = getCover(details.album);

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
                            <div className='col-lg-8 col-md-7 col-10'>
                                {headerContent}
                            </div>
                            <div className='col-1'>
                                <Button onClick={() => Events.fire('getTracks', 'albumID', details.album.id, 'shuffle')}><Shuffle size={20} /></Button>
                            </div>
                            <div className='col-1'>
                                <Button onClick={editing? updateAlbumInfo : () => setEditing(true)}>{editing? <CheckLg size={24} /> : <Pencil size={20} /> }</Button>
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

                <div className='spacer-300' />
            </div>
            <ControllArea playback={playback} />
        </div>
    )
}