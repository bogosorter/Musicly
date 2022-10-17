import { useState } from 'react';
import './genrecreator.css';

/**
 * Allows to type in a new genre for an album, and passes it on to `createGenre`.
 */
export default function GenreCreator({ createGenre }) {

    const [focused, setFocused] = useState(false);
    const [genre, setGenre] = useState('+');

    function focus() {
        setFocused(true);
        setGenre('');
        document.querySelector('#genre-input').focus();
    }

    function blur() {
        setGenre('+');
        setFocused(false);
        if (genre != '') createGenre(genre);
    }

    function onChange(e) {
        setGenre(e.target.value);
    }

    function keyDown(e) {
        // If is pressed, create a genre
        if (e.key === 'Enter') {
            setGenre('+');
            setFocused(false);
            if (genre != '') createGenre(genre);
        } 
    }

    return (
        <div className='genre' onFocus={focus} onBlur={blur} tabIndex={-1}>
            <input id='genre-input' className='center-children' value={genre} onChange={onChange} onKeyDown={keyDown}/>
            <span onClick={blur}>{focused? <>&nbsp;&times;</> : null}</span>
        </div>
    );
}