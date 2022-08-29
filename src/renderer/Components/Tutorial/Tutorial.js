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
export default function Tutorial({setTutorial}) {

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
        <Button onClick={() => setTutorial(false)} type='outline'>Let's go!</Button>;

    const skip = <Button onClick={() => setTutorial(false)} type='outline'>Skip</Button>;


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
        text: <p style={{textAlign: 'center'}}>You can review this tutorial whenever you want, in the settings.</p>
    }, {
        title: 'Control Button',
        text: 'This is the control button. If you hover it, it will unfold and reveal two useful buttons: the cog will take you to the settings and the plus button allows you to enter new albums to your library. Try hovering the dummy bellow!',
        dummies: (
            <div id='control-button-container' style={{'--container-width': '180px'}}>
                <Button><Logo size={52}/></Button>
                <Button><Settings size={16}/></Button>
                <Button><Plus size={28}/></Button>
            </div>
        )
    }, {
        title: 'Searching',
        text: 'If you ever get lost in your huge library :), you can use the search box. Besides allowing to search for album title, track title, artist and composer, genres are suggested as you type. Click on them to further filter your albums. For instance, type \'pop-rock\' in the box bellow, and make sure that you can check and uncheck genres.',
        dummies: <SearchDummy />
    }, {
        title: 'Albums',
        text: 'Hovering an album cover will show buttons that allow to play and view details. Furthermore, right clicking on it will bring up a context menu with a handful of useful actions. Give it a try!',
        dummies: (
            <div className='col-4'>
                <Cover album={{id: 0}} buttons={['play', 'details']} parent='dummy' />
            </div>
        )
    }, {
        title: 'Tracks',
        text: 'These are the actual music tracks. You may click on them to play or bring up a context menu with a right click.',
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
        title: 'Control Area',
        text: 'Here you can pause, play, skip and seek the currently playing track. Clicking on the track info or on the music note will take you to the queue.',
        dummies: (
            <ControllArea
                playback={{
                    album: { title: 'Super cool album' },
                    track: { title: 'Super cool track' },
                    progress: () => 0.35,
                    playing: () => true
                }}
                dummy={true}
            />
        )
    }, {
        title: 'Queue',
        text: 'On the queue, you can view the tracks that will play next and the cover on fullscreen.',
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