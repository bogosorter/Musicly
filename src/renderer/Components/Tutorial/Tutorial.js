import Button from '../Button/Button';
import { GearFill, Plus } from 'react-bootstrap-icons';
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
        title: 'Personal note',
        text: 'As of this writing, 50 people use Musicly every day. I can\'t but be grateful for my small project to have become something useful. However, one thing disturbs me: I know nothing about those using Musicly: not what pleases them, what they dislike, nor which new features they would like to see. If any of you would like to express your opinion, my email is the following: luiswbarbosa@gmail.com. I would really appreciate it.'
    }, {
        title: 'Control Button',
        text: <>This is the control button. If you hover it, it will unfold and reveal two useful buttons: <GearFill size={15} /> will take you to the settings and <Plus size={24} /> allows you to add albums to Musicly. Try hovering the button bellow!</>,
        dummies: (
            <div id='control-button-container' style={{'--container-width': '180px'}}>
                <Button><Logo size={52}/></Button>
                <Button><GearFill size={16}/></Button>
                <Button><Plus size={28}/></Button>
            </div>
        )
    }, {
        title: 'Searching',
        text: 'Use this box to filter for album title, track title, artist and composer. Genres are suggested as you type. Click on them to further filter your albums. For instance, type \'pop-rock\' in the box bellow, and try to check and uncheck genres.',
        dummies: <SearchDummy />
    },{
        title: 'Mini-player',
        text: 'Clicking on the minimize button will transform Musicly into a small window which sticks on top of the screen.',
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
        title: 'What\' new on 0.3.0',
        text: <>
            <p><strong>Queue management:</strong> you can now delete and reorder tracks in the queue.</p>
            <p><strong>Edit information:</strong> you can now change album and track information. Changes will apply to the database and, if the music files are in <code>mp3</code> format, to the files themselves.</p>
        </>
    }, {
        title: 'Additional info',
        text: <>You can review this tutorial whenever you want, in the settings. You are also welcome to see the app's complete <a href='https://m7kra.github.io/Musicly/docs/user' target='_blank'>documentation</a> (including how to custom style it). I hope you like Musicly!</>
    },
];