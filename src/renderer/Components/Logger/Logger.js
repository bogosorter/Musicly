import Button from '../Button/Button';
import { Close }  from '../Icons/Icons';

import { useState } from 'react';
import './logger.css';

let log;
let messages = [];

/**
 * Displays a list of log messages.
 */
export default function Logger({messages, addLog}) {

    if (messages.length == 0) return <></>;

    const logs = messages.map((message, index) =>  {
        return (
            <div className={'log ' + (message.type == 'error'? 'bg-danger' : 'bg-success')} key={index}>
                <div className='me-2 flex-grow-1'>{message.message}</div>
                <Button onClick={() => addLog(['remove', index])} size={30}><Close /></Button>
            </div>
        )
    })

    return (
        <div id='logger'>
            {logs}
        </div>
    );
}