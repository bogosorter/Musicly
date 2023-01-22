import Button from '../Button/Button';
import { X } from 'react-bootstrap-icons';

import { useState } from 'react';
import './logger.css';

/**
 * Displays a list of log messages.
 */
export default function Logger({logs, removeLog}) {

    if (logs.length == 0) return <></>;

    const rendered = logs.map((log, index) =>  {
        onClick = () => log.href? window.open(log.href, '_blank') : () => null;
        return (
            <div className={'log ' + (log.type == 'error'? 'bg-danger' : 'bg-success') + (log.href? ' clickable' : '')} key={index} onClick={onClick}>
                <div className='me-2 flex-grow-1'>{log.message}</div>
                <Button onClick={() => removeLog(index)} size={30}><X size={28}/></Button>
            </div>
        )
    })

    return (
        <div id='logger'>
            {rendered}
        </div>
    );
}