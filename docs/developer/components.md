---
permalink: /docs/dev/components
layout: docs
title: Controller
---

# Components
{:.no_toc}

## Table of Contents
{:.no_toc}

* TOC
{:toc}

## `App`

**Description:** This is the main component. It stores a series of states and renders four other components (`Library`, `Settings`, `AlbumDetails` and `Queue`) according to `view`. It also renders a bunch of other components used throughout the app: a `ContextMenu`, a spinner if `loading` and a `Tutorial` if `settings.firstTime`.

**Properties:** None

**Hooks:**

```js
const [view, setView] = useState('library');

// Info about the user's library
const [library, setLibrary] = useState({
    searchParameters: {
        query: '',
        genre: ''
    },
    albums: [], // Array of albums that match the search parameters
    tracks: [], // Array of tracks that match the search parameters
    genres: [] // Array of all genres in library 
});

// Info about what is playing and the queue
const [playback, setPlayback] = useState({
    album: {}, // Object that stores info about the playing album
    track: {}, // Object that stores info about the playing track
    queue: [], // Array of tracks in queue
    position: 0, // Index of the playing track in queue
    progress: () => 0, // Returns a value between 0 and 1
    playing: () => false // Is playback playing or paused?
});

// Info about what should be displayed in the AlbumDetails component
const [details, setDetails] = useState({
    album: {}, // Generic album info
    tracks: [], // List of album tracks
});

// Variable that stores current settings
const [settings, setSettings] = useState({});

// Logs that the user should see
const [logs, addLog] = useReducer((state, message) => {
    // To reset the logs, use 'reset' as the message
    if (message === 'reset') {
        return [];
    }
    return [...state, message];
}, [])

// Controlls whether a spinner should be shown
const [loading, setLoading] = useState(false);

const controller = useMemo(
    new Controller(setView, setLibrary, setDetails, setSettings, setPlayback, setLoading, addLog)
);
```

## `Library`

**Description:** Component rendered inside the `App`, displaying a `SearchBox`, library albums, a `TrackList` that matches search parameters and a `ControllArea`.

**Properties:** `library`, `playback`

## `AlbumDetails`

**Description:** Component rendered inside the `App`, displaying an album's details such as `Cover`, `TrackList` and `artist`. Also has a `ControllArea`.

**Properties:** `details`, `playback`

## `Queue`

**Description:** Component rendered inside the `App`, containing a `ControllArea` and a list of the tracks that will play next.

**Properties:** `playback`

## `Settings`

**Description:** Displays current settings, using the `Setting` component, and allows to modify them. The setting `firstTime` should not be displayed nor modified, and the new settings should be saved automatically. This component should also allow to reset the settings, reset the library and to go through the tutorial again.

**Properties:** `settings`

## `Header`

**Description:** Displays the app's header bar, with app navigation utilities and window buttons. Specifically, people should be able to access `settings` and open files if a `library` is true (meaning that the parent of the component is `Library`), and go back to the library otherwise. Furthermore, the normal three window control buttons have to be displayed.

**Properties:** `library`

## `ControllArea`

**Description:** Displays information about the currently playing track (cover, name and album), and allows to seek, pause, play, skip forward and skip backward. If `dummy`, no events should be fired (this is used in the tutorial).

**Properties:** `playback`, `dummy = false`

## `Cover`

**Description:** Displays an album cover. Some buttons are displayed according to the value of `buttons` (`play` for playing the album and `details` for a detailed album view). Right clicking on the album should bring up a context menu with the following options: play album, add album to queue, album details, add cover and delete album.

**Properties:** `album`, `buttons = []`, `parent` (may contain `play` and `details`).

## `ContextMenu`

**Description:** Renders a context menu on a given `position`, showing it whenever it is `visible`. The same file should also give access to a function, `addContextMenu`, which allows to set the states of `ContextMenu`. Please note that the component should be designed in such a way that it is called only once. Furthermore, the `items` that are passed onto `addContextMenu` should be an array dictionaries with entries `text` and `onClick`.

**Properties:** None

**Hooks:**

```js
// Which items are to be displayed in the context menu
const [items, setItems] = useState([]);
// The coordinates of the context menu
const [position, setPosition] = useState({x:0, y:0});
// Whether the context menu should be shown
const [visible, setVisibility] = useState(false);
```

## `Logger`

**Description:** Displays a list of log messages.

**Properties:** `messages`, `reset`

## `SearchBox`

**Description:** Allows users to type in a `query` and choose one `genre` filter.

**Properties:** `searchParameters`, `genres`

## `TrackList`

**Description:** Displays a list of tracks. If `parent == AlbumDetails`, a separator between different discs should be added. This component has to pass to its children whether a track is playing or not, which is a bit complicated given that it is a general component. If `TrackList` is rendered inside `AlbumDetails` and `Library`, we can just check for `track.id`. In the queue, however, the same track may appear multiple times, and we have to check if `index == playback.position`.

**Properties:** `playback`, `dummy = false`, `parent`.

## `Track`

**Description:** Displays a single track. The component should display the track number and name, and also a sprite if it is currently playing. The last property specifies which tracks should be played if this track is clicked (in an album, for instance, you want the user to be able choose a track and play all the ones that come after it). An optional property `dummy` should prevent all events from being fired. It is used in the tutorial.

**Properties:** `track`, `classes`, `playing`,  and `tracksToPlay`

## `Setting`

**Description:** Displays a single `setting`. A property `theme` is needed because code input depends on it. In order to modify the setting, `modify` should be called. The value to be passed to the function is the entire setting. Here is an example:

```js
setting = {
        name: 'Theme',
        type: 'select',
        options: ['light', 'dark'],
        value: 'dark'
};
setting.selected = 'dark';
modify(setting);
```

**Properties:** `setting`, `modify`, `theme`

## `Tutorial`

**Description:** Renders a brief introductory tutorial, based on a series of slides.

**Properties:** `setTutorial` (closes the tutorial when called with the argument `false`.

## `Genre`

**Description:** Renders a single genre tag. In case `deleteButton` is not undefined, an option should be added to remove the genre, triggering the `deleteButton` function.

**Properties:** `genre`, `deleteButton`.

## `ProgressBar`

**Description:** Sets up a progress bar that regularly updates. Furthermore, allows to set the a new position firing the `setProgress` event. `dummy`, used inside the tutorial, prevents all events from being fired.

**Properties:** `getProgress`, `dummy = false`

## `Button`

**Description:** Wrapper component that builds a button around its children. Also sets up a shortcut that for `onClick`, which should be removed when the button removed from the DOM.

**Properties:** `onClick`, `type = box` (`box`, `round`, `nodecor`, or `box`) and `shortcuts`.

## `SearchDummy`

**Description:** Implements a dummy search box, used inside tutorial.

**Properties:** None

## `Icons`

**Description:**  Rather than a component, this module provides a series of icon components. Each of them accepts a property `size` defaulting to 32. The following icons are included: `Logo`, `Play`, `Pause`, `SkipFwd`, `SkipBwd`, `Settings`, `Square`, `Plus`, `Circle`, `CircleOutline`, `List`, `CD`, `Search`, `Back`, `Queue`, `Close`.


