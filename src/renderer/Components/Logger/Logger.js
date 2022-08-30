import Button from '../Button/Button';

import { useState } from 'react';
import './logger.css';

let log;
let messages = [];

/**
 * Displays a list of log messages.
 */
export default function Logger({messages, reset}) {

    if (messages.length == 0) return <></>;

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
                <Button onClick={reset} type='outline'>OK</Button>
            </div>
        </>
    );
}