import Button from '../Button/Button';
import { Logo, Back, Settings, Plus, Play, Line, Square, Close } from '../Icons/Icons';

import Events from 'renderer/Events/Events';
import { useEffect, useState } from 'react';
import './header.css'

/**
 * Displays the app's header bar, with app navigation utilities and window
 * buttons. Specifically, people should be able to access `settings` and open
 * files if a `library` is true (meaning that the parent of the component is
 * `Library`), and go back to the library otherwise. Furthermore, the normal
 * three window control buttons have to be displayed.
 */
export default function Header({ library = false }) {

    let navigationButtons;
    // If library, parent is library
    if (library) {
        navigationButtons = [
            { onClick: () => null, content: <Logo size={52}/> },
            { onClick: () => Events.fire('changeView', 'settings'), content: <Settings size={16}/>, shortcuts: ['ctrl+s', 's'] },
            { onClick: () => Events.fire('open', 'folder'), content: <Plus size={28}/>, shortcuts: ['ctrl+o', 'o']}
        ]
    } else {
        navigationButtons = [{ onClick: () => Events.fire('changeView', 'library'), content: <Back />, shortcuts: ['escape', 'alt+arrowleft'] }]
    }
    navigationButtons = navigationButtons.map((button, index) => {
        return <Button onClick={button.onClick} key={index} shortcuts={button.shortcuts}>{button.content}</Button>
    });

    // Buttons that handle window position and size
    let windowButtons = [
        {event: 'minimize', content: <Line size={16} />},
        {event: 'maximize', content: <Square size={24} />},
        {event: 'close', content: <Close size={24} />},
    ]
    windowButtons = windowButtons.map((button, index) => {
        const onClick = () => Events.fire('windowButton', button.event);
        return <Button onClick={onClick} key={index}>{button.content}</Button>
    });

    return (
        <div className='header d-flex hide-if-not-active w-100'>
            <div className='w-50'>
                <div id='control-button-container' style={{'--container-width': `${navigationButtons.length * 60}px`}}>
                    {navigationButtons}
                </div>
            </div>
            <div className='w-50 d-flex flex-column align-items-end'>
                <div className='d-flex'>
                    {windowButtons}
                </div>
            </div>
        </div>
    )
}