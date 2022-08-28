import Button from '../Button/Button';

import { useState } from 'react';
import './logger.css';

let log;
let messages = [];

/**
 * Displays a list of log messages. In a structure similar to the one of
 * `ContextMenu`, it should desinged in such a way that it is called only once.
 * From then on, a function, `log`, should be used to add new log messages.
 */
function Logger() {

    // Whether component is visible or not
    const [visible, setVisibility] = useState(false);

    // Add a new message to the list of messages
    log = (message) => {
        messages = [...messages, message];
        setVisibility(true);
    }

    function ok () {
        setVisibility(false);
        messages = [];
    }

    if (!visible) return <></>;

    return (
        <>
            <div id='logger-backdrop' />
            <div id='logger'>
                <h2>Some errors occured:</h2>
                <div className='spacer-24' />
                { messages.map((message, index) => (
                    <div key={index}>{message}</div>
                )) }
                <div className='spacer-24' />
                <Button onClick={ok} type='outline'>OK</Button>
            </div>
        </>
    );
}

export { log, Logger };