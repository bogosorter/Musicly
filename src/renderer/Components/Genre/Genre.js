import './genre.css';

/**
 * Component that renders a single genre tag. Its arguments are `genre` and
 * `deleteButton`. In case `deleteButton` is not undefined, an option should be
 * added to remove the genre, triggering the `deleteButton` function.
 */
export default function Genre({genre, onClick, deleteButton}) {
    if (deleteButton) {
        return (
            <div className='genre' onClick={onClick}><div className='w-100 center-children'>{genre}</div>&nbsp;&times;</div>
        );
    } else {
        return <div className='genre' onClick={onClick}><div className='w-100 center-children'>{genre}</div></div>;
    }
}