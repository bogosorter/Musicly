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
        title: 'What\' new on 0.4.0',
        text: <>
            <p><strong>File drag and drop:</strong> you can now drop files into the library.</p>
            <p><strong>Gapless playback:</strong> following a <a href='https://www.linuxlinks.com/musicly-simple-music-player/' target='_blank'>review</a> by LinuxLinks, I have reduced the gap between different tracks to about 15ms.</p>
            <p><strong>Repeat and shuffle:</strong> the same review led me to implement repeat and shuffle options. On the bottom of the control area, you will find <Repeat/>. You can click on it to toggle between <code>off</code>, <code>repeat once</code> and <code>repeat forever</code>. Furthermove, right clicking on an album's cover will allow you to shuffle it. The same can be achieved from the album details section.</p>
        </>
    }, {
        title: 'What\' new on 0.4.0',
        text: <>
            <p><strong>Control button is gone:</strong> for user friendliness, the control button is now permanently unfolded. Check <a href='https://m7kra.github.io/Musicly/docs/user#control-button' target='_blanck'>this</a> to bring it back to normal.</p>
        </>
    }, {
        title: 'Get in touch',
        text: <p style={{userSelect: 'text'}}>I know next to nothing about my users and their tastes. If you would like to provide feedback, have new features or just give a thumbs up, contact me at luiswbarbosa@gmail.com. I would really appreciate it!</p>
    }, {
        title: 'Additional info',
        text: <>You can review this tutorial whenever you want, in the settings. You are also welcome to see the app's complete <a href='https://m7kra.github.io/Musicly/docs/user' target='_blank'>documentation</a> (including how to custom style it). I hope you like Musicly!</>
    }
];