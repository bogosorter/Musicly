import Button from '../Button/Button';
import { Logo, Back, Settings, Plus, Play, Line, Square, Close } from '../Icons/Icons';

import Events from 'renderer/Events/Events';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import './header.css'

/**
 * Component that displays the app's header bar, with app navigation utilities
 * and window buttons. Specifically, people should be able to access `library`,
 * `settings` and open files (if a `setLibrary` function is provided), as well
 * as the normal three window control buttons.
 */
export default function Header({ setLibrary = null }) {

    let navigationButtons;
    // If setLibrary, parent is library
    if (setLibrary) {
        navigationButtons = [
            { onClick: () => null, content: <Logo size={52}/> },
            { onClick: () => Events.fire('setView', 'settings'), content: <Settings size={16}/>, shortcuts: ['ctrl+s', 's'] },
            { onClick: () => Events.fire('open', setLibrary), content: <Plus size={28}/>, shortcuts: ['ctrl+o', 'o']}
        ]
    } else {
        navigationButtons = [{ onClick: () => Events.fire('setView', 'library'), content: <Back />, shortcuts: ['escape', 'alt+arrowleft'] }]
    }
    navigationButtons = navigationButtons.map(button => {
        return <Button onClick={button.onClick} key={nanoid()} shortcuts={button.shortcuts}>{button.content}</Button>
    });

    // Buttons that handle window position and size
    let windowButtons = [
        {event: 'minimize', content: <Line size={16} />},
        {event: 'maximize', content: <Square size={24} />},
        {event: 'close', content: <Close size={24} />},
    ]
    windowButtons = windowButtons.map(button => {
        const onClick = () => Events.fire('windowButton', button.event);
        return <Button onClick={onClick} key={nanoid()}>{button.content}</Button>
    });

    return (
        <div className='header d-flex hide-if-not-active w-100'>
            <div className='w-50'>
                <div id='controll-button-container' style={{'--container-width': `${navigationButtons.length * 60}px`}}>
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