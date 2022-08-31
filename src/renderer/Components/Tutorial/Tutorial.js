import Button from '../Button/Button';
import { Logo, Settings, Plus } from '../Icons/Icons';
import SearchDummy from '../SearchDummy/SearchDummy';
import Cover from '../Cover/Cover';
import Track from '../Track/Track';
import ControllArea from '../ControllArea/ControllArea';
import Button from '../Button/Button';

import { useReducer, useMemo } from 'react';
import './tutorial.css';
import icon from '../../../../assets/icon.png';
import queue from '../../../../assets/queue.png';
import inactive from '../../../../assets/inactivity.png';

/**
 * Component that renders a brief introductory tutorial, based on a series of
 * slides. Its single property is `setTutorial`.
 */
export default function Tutorial({dismissTutorial}) {

    const [currentSlide, changeSlide] = useReducer((state, change) => state + change, 0);

    // Here, the slide skeleton of `content` is converted in to real html
    const slides = useMemo(() => content.map((slide, index) =>
        <div className='slide' key={index}>
            <h1>{slide.title}</h1>
            <div className='spacer-12' />
            <p className='fs-5'>{slide.text}</p>
            <div className='center-children'>
                {slide.dummies}
            </div>
            <div className='spacer-24' />
        </div>
    ), []);

    const previousButton = currentSlide != 0 && <Button onClick={() => changeSlide(-1)} type='outline'>Previous</Button>;
    const nextButton = currentSlide < content.length - 1?
        <Button onClick={() => changeSlide(1)} type='outline'>Next</Button> :
        <Button onClick={() => dismissTutorial()} type='outline'>Let's go!</Button>;

    const skip = <Button onClick={() => dismissTutorial()} type='outline'>Skip</Button>;


    return (
        <>
        <div id='tutorial-backdrop' />
        <div id='tutorial'>
            {slides[currentSlide]}
            <div className='tutorial-buttons'>
                {previousButton}<div className='w-100' />{skip}{nextButton}
            </div>
        </div>
        </>
    )
}

// Content is an array of slides. Each slide may have three properties:
// `title`, `text` and `image`
const content = [{
        title: 'Welcome!',
        text: <div style={{textAlign: 'center'}}>You can review this tutorial whenever you want, in the settings.</div>
    }, {
        title: 'Control Button',
        text: <>This is the control button. If you hover it, it will unfold and reveal two useful buttons: <Settings size={15} /> will take you to the settings and <Plus size={24} /> allows you to add albums to Musicly. Try hovering the button bellow!</>,
        dummies: (
            <div id='control-button-container' style={{'--container-width': '180px'}}>
                <Button><Logo size={52}/></Button>
                <Button><Settings size={16}/></Button>
                <Button><Plus size={28}/></Button>
            </div>
        )
    }, {
        title: 'Searching',
        text: 'Use this box to filter for album title, track title, artist and composer. Genres are suggested as you type. Click on them to further filter your albums. For instance, type \'pop-rock\' in the box bellow, and try to check and uncheck genres.',
        dummies: <SearchDummy />
    }, {
        title: 'Albums',
        text: 'Hovering an album cover will show buttons that allow to play and view details. A menu pops-up if you right click it',
        dummies: (
            <div className='col-4'>
                <Cover album={{id: 0}} buttons={['play', 'details']} parent='dummy' />
            </div>
        )
    }, {
        title: 'Tracks',
        text: 'These are the actual music tracks. You may click on them to play or right click to bring up a menu',
        dummies: (
            <Track
                track={{ title: 'Super cool track', trackOrder: 1 }}
                classes={[ 'track-top', 'track-bottom' ]}
                tracksToPlay={[]}
                playing={true}
                dummy={true}
            />
        )
    }, {
        title: 'Queue',
        text: 'On the queue view, you can view the tracks that will play next and the cover on fullscreen.',
        dummies: (
            <div className='w-100 row'>
                <div className='spacer-24' />
                <div className='col-6'>
                    <img src={queue} style={{borderRadius: 'var(--border-radius)', width: '100%'}} />
                </div>
                <div className='col-6'>
                    <img src={inactive} style={{borderRadius: 'var(--border-radius)', width: '100%'}} />
                </div>
            </div>
        )
    }, {
        title: 'Additional info',
        text: <>You can review this tutorial whenever you want, in the settings. You are also welcome to see the app's complete <a href='https://m7kra.github.io/Musicly/docs/user' target='_blank'>documentation</a> (including how to custom style it). I hope you like Musicly!</>
    }
];