import Button from '../Button/Button';
import { GearFill, Plus, Repeat } from 'react-bootstrap-icons';
import { Logo } from '../Icons/Icons';
import SearchDummy from '../SearchDummy/SearchDummy';
import Cover from '../Cover/Cover';
import Track from '../Track/Track';
import ControllArea from '../ControllArea/ControllArea';
import Button from '../Button/Button';
import MiniPlayer from '../MiniPlayer/MiniPlayer';

import { useReducer, useMemo } from 'react';
import './tutorial.css';
import miniplayer from '../../../../assets/miniplayer.png';
import miniplayer2 from '../../../../assets/miniplayer2.png';

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

    const skip = currentSlide > 0? <Button onClick={() => dismissTutorial()} type='outline'>Skip</Button> : null;


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
        text: <>
            <p style={{textAlign: 'center'}}>You can review this tutorial whenever you want, in the settings.</p>
            <p className='note' style={{textAlign: 'center'}}>Those already using Musicly should check out the "What's new" section</p>
        </>
    }, {
        title: 'Searching',
        text: 'Use this box to filter for album title, track title, artist and composer. Genres are suggested as you type. Click on them to further filter your albums. For instance, type \'pop-rock\' in the box bellow, and try to check and uncheck genres.',
        dummies: <SearchDummy />
    },{
        title: 'Mini-player',
        text: 'Clicking on the minimize button will transform Musicly into a small window which sticks on top of the screen. Hover over it to control playback. You can also drag it around, holding on the album\'s cover.',
        dummies: (
            <div id='dummy-miniplayer-container'>
                <MiniPlayer playback={{
                    playing: () => true,
                    track: {
                        title: 'Super cool track',
                    }
                }} dummy={true} />
            </div>
        )
    }, {
        title: 'What\' new on 0.4.1',
        text: <>
            <p>I have a lot to apologize for in this version. To begin with, I have previously claimed that gapless playback was implemented. It turns out that I hadn't understood the meaning of gapless playback... I'm sorry for this mistake. On a more positive note, I've made some progress in that direction and may release an update with it in the future.</p>
            <p>The last version also introduced some bugs regarding queue management. They should all be fixed by now, but feel free to email me if these bugs persist.</p> 
        </>
    }, {
        title: 'Special Thanks',
        text: <>
            <p>I would like to thank Steve Emms and Luke Baker at <a href='https://www.linuxlinks.com/' target='_blank'>LinuxLinks.com</a> for their friendliness and patience. They have been helping me a lot!</p>
        </>
    }, {
        title: 'Get in touch',
        text: <p style={{userSelect: 'text'}}>I know next to nothing about my users and their tastes. If you would like to provide feedback, have new features or just give a thumbs up, contact me at luiswbarbosa@gmail.com. I would really appreciate it!</p>
    }, {
        title: 'Additional info',
        text: <>You can review this tutorial whenever you want, in the settings. You are also welcome to see the app's complete <a href='https://m7kra.github.io/Musicly/docs/user' target='_blank'>documentation</a> (including how to custom style it). I hope you like Musicly!</>
    }
];