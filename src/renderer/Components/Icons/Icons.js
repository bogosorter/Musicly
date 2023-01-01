import logo from '../../../../assets/icon.png';
import './icons.css';

/**
 * Module that contains a series of icons used throughout the app. Each of the
 * icons accepts a property `size` defaulting to 32.
 */

function Logo({size = 32}) {
    return (
        <div style={{width: `${size}px`, aspectRatio: '1/1', backgroundSize: 'cover', backgroundImage: `url(${logo})`}}></div>
    );
}

function Line({size = 32}) {
    return (
        <svg width={size} height={size} fill="currentColor" stroke='currentColor' viewBox="0 0 16 16" strokeWidth='1'>
            <line x1="0" y1="16" x2="16" y2="16" />
        </svg>
    )
}

export { Logo, Play, Pause, SkipFwd, SkipBwd, Square, Line, Settings, Plus, Circle, CircleOutline, List, CD, Search, Back, Queue, Close, Fullscreen, Collapse, Edit, Check}