import { useReducer, useMemo } from 'react';
import Button from '../Button/Button';
import SearchDummy from '../SearchDummy/SearchDummy';
import MiniPlayer from '../MiniPlayer/MiniPlayer';
import './tutorial.css';

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
// `title`, `text` and `dummies`
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
    }, {
        title: 'Mini-player',
        text: 'Clicking on the minimize button will transform Musicly into a small window that sticks on top of the screen. Hover over it to control playback. You can also drag it around, holding on the album\'s cover.',
        dummies: (
            <div id='dummy-miniplayer-container'>
                <MiniPlayer playback={{
                    playing: () => true,
                    track: {
                        title: 'Super cool track',
                    }
                }} dummy />
            </div>
        )
    }, {
        title: 'A note for Snapcraft users',
        text: <p>
            If you are using the Snapcraft version of Musicly, you may notice
            that music searching is at the user level. This happens due to
            Snapcraft restrictions. To fix it, install the <code>.deb </code>
            package from <a href='https://bogosorter.github.io/Musicly/' target='_blank' rel='noreferrer'>
            Musicly's website</a>.</p>
    }, {
        title: 'What\' new on 0.5.0',
        text: <>
            <p>A long time has passed since Musicly's last update. For an explanation check&nbsp;
            <a href='https://bogosorter.github.io/blog/?post=3' target='_blank' rel='noreferrer'>this</a>
            &nbsp;blog post. Meanwhile, here's what changed:</p>
            <ul>
                <li>Gapless playback won't be supported in the near future</li>
                <li>Repeat button now has standard behavior</li>
                <li>New shuffle button</li>
                <li>Bug fixes and other improvements</li>
            </ul>
        </>
    }, {
        title: 'Get in touch',
        text: <p style={{userSelect: 'text'}}>
            Musicly users have reached out to me and their feedback is
            the reason for some of the changes in this update. If you'd like
            to report bugs, ask for new features or just give a thumbs up,
            contact me at <code>luiswbarbosa@gmail.com</code>. I would really appreciate it!</p>
    }, {
        title: 'Additional info',
        text: <>You can review this tutorial whenever you want, in the settings. You are also welcome to see the app's <a href='https://bogosorter.github.io/Musicly/docs/user' target='_blank' rel="noreferrer">user guide</a> (including how to custom style it). I hope you like Musicly!</>
    }
];