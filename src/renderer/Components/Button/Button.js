import Shortcuts from '../../Shortcuts/Shortcuts';

import { useEffect } from 'react';
import './button.css';
/**
 * Wrapper class that builds a button around its children. Also accepts
 * `onClick` and `type` (`box`, `round`, `nodecor`, defaulting to `box`) as
 * properties.
 */
export default function Button({onClick, type = 'box', shortcuts, children, size = null}) {

    // Depending on the type of the button, different classes are added
    const classes = ['button'];
    if (type != 'nodecor') classes.push('center-children');
    if (type == 'box') classes.push('box-button');
    if (type == 'round') classes.push('round-button');
    if (type == 'outline') classes.push('outline-button');

    // Setup the shortcuts
    useEffect(() => {
        // Setup shortcuts
        if (shortcuts) {
            Shortcuts.add(onClick, ...shortcuts);
            return () => Shortcuts.remove(...shortcuts);
        }
    });
    
    return (
        <div onClick={onClick} className={classes.join(' ')} style={size ? {minHeight: size, minWidth: size} : null}>
            {children}
        </div>
    );
}