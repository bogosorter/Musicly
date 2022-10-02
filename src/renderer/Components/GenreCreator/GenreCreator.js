import { useState } from 'react';
import './genrecreator.css';

/**
 * Allows to type in a new genre for an album, and passes it on to `createGenre`.
 */
export default function GenreCreator({ createGenre }) {

    const [focused, setFocused] = useState(false);
    const [genre, setGenre] = useState('+');

    function focus() {
        console.log('focused');
        setFocused(true);
        setGenre('');
        document.querySelector('#genre-input').focus();
    }

    function blur() {
        setFocused(false);
        setGenre('+');
    }

    function onChange(e) {
        setGenre(e.target.value);
    }

    function keyDown(e) {
        console.log(e.key);
        // If is pressed, create a genre
        if (e.key === 'Enter') {
            setGenre('+');
            setFocused(false);
            createGenre(genre);
        } 
    }

    return (
        <div className='genre' onFocus={focus} onBlur={blur} tabIndex={-1}>
            <input id='genre-input' className='w-100 center-children' value={genre} onChange={onChange} onKeyDown={keyDown}/>
            <span onClick={blur}>{focused? <>&nbsp;&times;</> : null}</span>
        </div>
    );
}