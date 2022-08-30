import { Search } from '../Icons/Icons';
import Button from '../Button/Button';
import Genre from '../Genre/Genre';

import Events from 'renderer/Events/Events';
import { useEffect } from 'react';
import './searchbox.css';

/**
 * Component that allows users to type in a `query` and choose one `genre`
 * filter. Accepts `searchParameters` as property and a property `dummy`,
 * defaulting to false, that should only be true inside tutorial.s
 */
export default function SearchBox({searchParameters, genres, dummy = false}) {

    // Changes search parameters to the new query
    function setQuery(e) {
        searchParameters.query = e.target.value;
        search();
    }
    // Changes search parameters to the new genre
    function setGenre(genre) {
        searchParameters.genre = genre;
        searchParameters.query = '';
        search();
    }
    // Removes the genre from search parameters
    function removeGenre() {
        searchParameters.genre = '';
        search();
    }
    // Calls the controller's method for searching
    function search() {
        if (!dummy) Events.fire('getLibrary', searchParameters);
        // If search box is a dummy, setLibrary is used to update its props in
        // the parent component
        else setLibrary({...searchParameters});
    }

    // SearchBox should display a genre filter. When none is selected, a genre
    // matching the query should be suggested. This genre should be as short as
    // possible. Why? Imagine that the user is searching for `Rock`. He may
    // never be able to select that filter because the program is suggesting
    // `Alternative Rock`. This problem can be solved by choosing the string
    // with the smallest length
    let suggestedGenre;
    if (!searchParameters.genre && searchParameters.query) {
        const lower = searchParameters.query.toLowerCase();
        const matchingGenres = genres.filter(genre => {
            return genre.toLowerCase().indexOf(lower) != -1;
        })
        // Sort by length
        // https://stackoverflow.com/questions/40864915/find-the-shortest-string-in-array
        if (matchingGenres.length > 0) suggestedGenre = matchingGenres.reduce((a, b) => a.length < b.length? a : b);
    }

    let genre;
    if (suggestedGenre || searchParameters.genre) {
        genre = <Genre
            genre={searchParameters.genre || suggestedGenre}
            onClick={searchParameters.genre? removeGenre : () => setGenre(suggestedGenre)}
            deleteButton={searchParameters.genre}
        />
    }

    return (
        <div id='search-box'>
            <div id='search-container'>
                <input
                    id='search-input'
                    onChange={setQuery}
                    spellCheck={false}
                    value={searchParameters.query}
                    placeholder='Search in library'
                />
                <Button onClick={() => document.querySelector('#search-input').focus()} shortcuts={['ctrl+f', 'f']}>
                    <Search size={24} />
                </Button>
            </div>
            <div className='d-flex justify-content-end mt-2'>
                {genre}
            </div>
        </div>
    )
}