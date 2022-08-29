import { useState, useEffect } from 'react';
import './contextmenu.css';

/**
 * Component that renders a context menu on a given `position`, showing it
 * whenever it is `visible`. The same file should also give access to a
 * function, `addContextMenu`, which allows to set the states of `ContextMenu`.
 * Please note that the component should be designed in such a way that it is
 * called only once. Furthermore, the `items` that are passed onto
 * `addContextMenu` should be an array dictionaries with entries `text` and
 * `onClick`.
 */

// Variables common to ContextMenu and to addContexMenu
let setItems;
let setPosition;
let setVisibility;

function ContextMenu() {
    // Variables that can be controlled by addContextMenu
    let items, position, visible;
    // Which items are to be displayed in the context menu
    [items, setItems] = useState([]);
    // The coordinates of the context menu
    [position, setPosition] = useState({x:0, y:0});
    // Whether the context menu should be shown
    [visible, setVisibility] = useState(false);

    const renderedItems = items.map((item, index) => {
        const onClick = () => {
            item.onClick();
            setVisibility(false);
        }
        return <div className='context-menu-item center-children' onClick={onClick} key={index}><p>{item.text}</p></div>;
    });

    useEffect(() => {
        if (visible) document.querySelector('#context-menu').focus();
    });

    return (
        <div
            id='context-menu'
            tabIndex={0}
            onBlur={() => setVisibility(false)}
            style={{ top: position.y, left: position.x, display: visible? 'block' : 'none' }}
        >
            {renderedItems}
        </div>
    )
}

function addContextMenu(element, items) {
    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        setItems(items);
        setPosition({x: e.clientX, y: e.clientY});
        setVisibility(true);
    });
}

export {
    ContextMenu,
    addContextMenu
}