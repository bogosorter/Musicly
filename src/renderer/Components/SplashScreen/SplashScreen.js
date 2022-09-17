import { useEffect } from 'react';
import logo from '../../../../assets/icon.png';

import './splashscreen.css';

export default function SplashScreen({setSplashScreen}) {

    useEffect(() => {
        setTimeout(() => {
            document.querySelector('#splash-screen > *')?.classList.add('show');
        }, 100);
        setTimeout(() => {
            document.querySelector('#splash-screen')?.classList.add('hide');
        }, 1500);
        setTimeout(() => setSplashScreen(false), 2000);
    })

    return (
        <div id='splash-screen'>
            <img src={logo} />
        </div>
    )
}