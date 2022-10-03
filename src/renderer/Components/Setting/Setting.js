import CodeEditor from '@uiw/react-textarea-code-editor';

import { useState } from 'react';
import { useEffect } from 'react';
import './setting.css';

/**
 * Component that displays a single `setting`. Its properties are `settingName`,
 * `setting` and `modify`. In order to modify the setting, `modify` should be
 * called. The value to be passed to the function is the entire setting.
 */
export default function Setting({setting, modify}) {

    function setValue(e) {
        setting.value = e.target.value;
        modify(setting);
    }
    
    // Render a select element
    if (setting.type == 'select') {
        const options = setting.options.map((option, index) => {
            return <option value={option} key={index}>{option}</option>
        });

        return (
            <>
                <h3>{setting.name}</h3>
                <select className='setting' onChange={setValue} value={setting.value}>
                    {options}
                </select>
            </>
        )
    }

    // Render a number input
    else if (setting.type == 'number') {

        const [value, setValue] = useState(setting.value);

        // This type requires a different setValue function, because we don't
        // want a string
        function storeValue(e) {

            let temp = e.target.value;
            // Prevent using comma instead of dot
            temp = temp.replace(',', '.');
            
            // If the user is still typing, don't store the new value
            if (temp[temp.length - 1] == '.' || temp == '' || temp[0] == '-') {
                setValue(temp);
                return;
            }

            setValue(temp);
            setting.value = parseFloat(temp);
            modify(setting);
        }

        return (
            <>
                <h3>{setting.name}</h3>
                <input className='setting' type='value' value={value} onChange={storeValue} />
            </>
        )
    }

    // Render a switch for booleans
    else if (setting.type == 'bool') {

        function setValue(e) {
            setting.value = e.target.checked;
            modify(setting);
        }

        const swtch = (
            setting.value? <input className='form-check-input' type='checkbox' onChange={setValue} checked />
            : <input className='form-check-input' type='checkbox' onChange={setValue} />
        )

        return (
            <>
                <h3>{setting.name}</h3>
                <div className='form-check form-switch'>
                    {swtch}
                </div>
            </>
        )
    }

    // Render a text input
    else if (setting.type == 'text') {
        return (
            <>
                <h3>{setting.name}</h3>
                <input type='text' className='setting' value={setting.value} onChange={setValue} />
            </>
        )
    }

    // Render a text input
    else if (setting.type == 'code') {

        // There are two different ways of saving the typed code: either by
        // blur or by being inactive for 10 seconds

        let timeoutID;
        // Timeout that executes setValue if not called again
        function storeValueAfterTimeout(e) {
            setting.value = e.target.value;
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => {
                modify(setting);
            }, 10000);
        }

        return (
            <>
                <h3>{setting.name}</h3>
                <div data-color-mode={window.settings.theme.value}>
                    <CodeEditor value={setting.value} language={setting.language} onChange={storeValueAfterTimeout} onBlur={setValue} padding={15} />
                </div>
            </>
        )
    }
}