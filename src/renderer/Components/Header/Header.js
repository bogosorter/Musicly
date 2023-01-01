import Button from '../Button/Button';
import { ArrowLeft, GearFill, Plus, Stop, X } from 'react-bootstrap-icons';
import { Logo, Line } from '../Icons/Icons';

import Events from 'renderer/Events/Events';
import { useEffect, useState } from 'react';
import './header.css'

/**
 * Displays the app's header bar, with app navigation utilities and window
 * buttons. Specifically, people should be able to access `settings` and open
 * files if `library` is true (meaning that the parent of the component is
 * `Library`), and go back to the library otherwise. The normal three window
 * control buttons must be displayed, and minimize should trigger mini player if
 * `settings.miniPlayer == true`.
 */
export default function Header({ library = false }) {
    
    let navigationButtons;
    if (library) {
        navigationButtons = [
            <div id='logo-container'><Button onClick={() => null} children={<Logo size={52}/>} key={0} /></div>,
            <Button onClick={() => Events.fire('changeView', 'settings')} children={<GearFill size={14}/>} shortcuts={['ctrl+s', 's']} key={1} />,
            <Button onClick={() => Events.fire('open', 'folder')} children={<Plus size={26}/>} shortcuts={['ctrl+o', 'o']} key={2} />
        ];
    } else {
        navigationButtons = [
            <Button onClick={() => Events.fire('changeView', 'library')} children={<ArrowLeft />} shortcuts={['escape', 'alt+arrowleft']} key={0} />
        ];
    }

    // Buttons that handle window position and size
    const minimizeAction = window.settings.miniPlayer && window.settings.miniPlayer.value?
        () => Events.fire('changeView', 'miniplayer') :
        () => Events.fire('windowButton', 'minimize');
    let windowButtons = [
        {onClick: minimizeAction, content: <Line size={16} />},
        {onClick: () => Events.fire('windowButton', 'maximize'), content: <Stop size={24} />},
        {onClick: () => Events.fire('windowButton', 'close'), content: <X size={28} />},
    ]
    windowButtons = windowButtons.map((button, index) => {
        return <Button onClick={button.onClick} key={index}>{button.content}</Button>
    });

    return (
        <div className='header d-flex hide-if-not-active w-100'>
            <div className='w-50'>
                <div className='d-flex m-2'>
                    {navigationButtons}
                </div>
            </div>
            <div className='w-50 d-flex flex-column align-items-end'>
                <div className='d-flex m-2'>
                    {windowButtons}
                </div>
            </div>
        </div>
    )
}