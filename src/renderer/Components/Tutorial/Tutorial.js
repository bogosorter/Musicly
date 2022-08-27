import Button from '../Button/Button';
import { Logo, Settings, Plus } from '../Icons/Icons';
import SearchDummy from '../SearchDummy/SearchDummy';
import Cover from '../Cover/Cover';
import Track from '../Track/Track';
import ControllArea from '../ControllArea/ControllArea';
import Button from '../Button/Button';

import { nanoid } from 'nanoid';
import { useReducer, useMemo } from 'react';
import './tutorial.css';
import icon from '../../../../assets/icon.png';
import queue1 from '../../../../assets/queue-1.png';
import queue2 from '../../../../assets/queue-2.png';

/**
 * Component that renders a brief introductory tutorial, based on a series of
 * slides. Its single property is `setTutorial`.
 */
export default function Tutorial({setTutorial}) {

    const [currentSlide, changeSlide] = useReducer((state, change) => state + change, 0);

    // Here, the slide skeleton of `content` is converted in to real html
    const slides = useMemo(() => content.map(slide => 
            <div className='slide' key={nanoid()}>
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
        title: 'Controll Button',
        text: 'This is the controll button. If you hover over it, it will unfold and reveal a series of usefull buttons: clicking on the icon will render the library view, and the cog will take you to the settings. Finally, the plus button allows you to enter new albums to your library. Try clicking a few on the dummie bellow!',
        dummies: (
            <div id='controll-button-container' style={{'--container-width': '180px'}}>
                <Button><Logo size={52}/></Button>
                <Button><Settings size={16}/></Button>
                <Button><Plus size={28}/></Button>
            </div>
        )
    }, {
        title: 'Searching',
        text: 'If you ever get lost in your huge library :), you can use the search box. Besides allowing to search for album title, track title and artist, genres are suggested as you type. Click on them to further filter your albums. For instance, type \'pop-rock\' in the box bellow, and make sure that you can check and uncheck genres.',
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
        text: 'Here you can pause, play, skip and seek the currently playing track. Furthermore, clicking on the album cover or on the track info will take you to the queue.',
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
        text: 'On the queue, you can view the current cover and track info on fullscreen, and, scrolling down, see the tracks that will play next',
        dummies: (
            <div className='w-100 row'>
                <div className='spacer-24' />
                <div className='col-6'>
                    <img src={queue1} style={{borderRadius: 'var(--border-radius)', width: '100%'}} />
                </div>
                <div className='col-6'>
                    <img src={queue2} style={{borderRadius: 'var(--border-radius)', width: '100%'}} />
                </div>
            </div>
        )
    }, {
        title: 'Aditional info',
        text: <>You can review this tutorial whenever you want, in the settings. You are also welcome to see our complete <a href='https://rc4-studio.github.io' target='_blank'>documentation</a> (including how to customize your app's appearence). We hope you like the app!</>
    }
];