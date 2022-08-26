# Musicly

## About

PhonoPhilos is a simple music player, constructed on top of electron-react-boilerplate

## Main process

There are three scripts in the main process: `main.js`, which sets up the app and the `BrowserWindow`, `settings.js` and `db.js`, obviously in charge of database access.

### Main

Initializes the app and creates a `BrowserWindow` (only one instance is allowed). Creates instances of `Settings` and `DB`. Also handles the following channels in `ipcMain`:

| Channel          | Description                                                                                                                                                        | Arguments          | Return value               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |:------------------:|:--------------------------:|
| `open`           | Calls `showOpenDialogSync` and adds the resulting files/folders to library.                                                                                        | -                  |                            |
| `addCover`       | Retrieves the path to the new cover and adds the cover to the library.                                                                                             | `albumID`          |                            |
| `windowButton`   | Resizes and closes the window according to the button pressed.                                                                                                     | `button`           |                            |
| `getLibrary`     | Gets all the albums that match `query` and `genre`. Also returns a small amount of matching tracks. If `genre` is an empty string, gets all the genres in library. | `searchParameters` | `{albums, tracks, genres}` |
| `getAlbum`       | Gets all the info of an album, including genres, artist and tracks.                                                                                                | `albumID`          | `album`                    |
| `getAlbumTracks` | Gets the tracks mapped to `albumID`.                                                                                                                               | `albumID`          | `tracks`                   |
| `getSettings`    | Gets app settings. If none are defined, return default settings.                                                                                                   | -                  | `settings`                 |
| `setSettings`    | Store the provided `settings`                                                                                                                                      | `settings`         | -                          |
| `resetSettings`  | Reset settings to their default value.                                                                                                                             | -                  | -                          |
| `resetLibrary`   | Deletes the database and creates a new one.                                                                                                                        | -                  | -                          |

### Settings

Class that manages app settings. Settings are represented as an array containing `subSettings`. These, in turn, have a property `type` which determines what the other properties are and what should be displayed in the `Settings` component. While `customCSS` is included in the settings structure, it is not conventional. It should be set in a file called `custom.css` in the `customCSSDir` and retrieved using the `getCustomCSS` function.

```js
const defaultSettings = {
    theme: {
        name: 'Theme',
        type: 'select',
        options: ['light', 'dark'],
        value: 'dark'
    },
    zoomFactor: {
        name: 'Zoom Factor',
        type: 'number',
        value: 1.25
    },
    customCSS: '',
    firstTime: true
}
```

**Methods**

| Name           | Description                                                      | Arguments  | Return value |
| -------------- | ---------------------------------------------------------------- |:----------:|:------------:|
| `get`          | Gets app settings. If none are defined, return default settings. | -          | `settings`   |
| `set`          | Store the provided `settings`                                    | `settings` | -            |
| `reset`        | Stores the predefined settings.                                  | -          | -            |
| `getCustomCSS` | Gets the user-defined CSS, returning `''` if none is defined.    | -          | `customCSS`  |

### DB

Class that manages the database.

`databaseFolder = [userData]/database/`

`databasePath = [userData]/database/database.db`

`coverFolder = [userData]/database/covers`

Allowed music formats: .flac, .mp3, opus, oga, ogg, aac, caf, m4a, weba

Allowed image formats: .png, .jpeg, .jpg, .jfif, .webp, .gif, .svg, .bmp, .ico

**Database Structure**

```sql
CREATE TABLE albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    artistID INTEGER,
    discCount INTEGER,
    coverPath TEXT
);
CREATE TABLE tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    albumID INTEGER,
    trackNumber INTEGER,
    disc INTEGER,
    path TEXT
);
CREATE TABLE artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);
CREATE TABLE genres (
    albumID INTEGER,
    genre TEXT
)
```

**Methods**

| Method           | Description                                                                                                                                                                                                                                                                                                                                                                       | Arguments                                                      | Return value               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |:--------------------------------------------------------------:|:--------------------------:|
| `init`           | Opens the database and creates a new one if there is none. Also sets up event handlers to close the database on exit. Should be called immediately after constructing.                                                                                                                                                                                                            | -                                                              | -                          |
| `create`         | Creates a new database at `databasePath`.                                                                                                                                                                                                                                                                                                                                         | -                                                              | -                          |
| `delete`         | Deletes the database.                                                                                                                                                                                                                                                                                                                                                             | -                                                              | -                          |
| `close`          | Closes the database.                                                                                                                                                                                                                                                                                                                                                              | -                                                              | -                          |
| `openPath`       | If path is a file, adds the track to a database. If it is a folder, recursively walks through it, adding all the contained tracks. While files in the same folder should be processed in a synchronized way (assuming that albums are in a same folder), files in different folders may be processed using async calls. Should return when all children processes are terminated. | `path`                                                         | -                          |
| `createTrack`    | Checks if `path` is a valid file format, and inserts a new track into the database. If there is no corresponding album, creates a new one.                                                                                                                                                                                                                                        | `path`                                                         | -                          |
| `createAlbum`    | Inserts a new album into the database. Also tries to add a cover, if there is any in `firstTrack`'s metadata or in the album directory. If there is no corresponding artist, creates a new one.                                                                                                                                                                                   | `firstTrack`, `directory`                                      | `albumID`                  |
| `deleteAlbum`    | Removes an album from the database, as well as all the tracks and genres associated with it.                                                                                                                                                                                                                                                                                      | `albumID`                                                      | -                          |
| `createArtist`   | Adds an artists to the database.                                                                                                                                                                                                                                                                                                                                                  | `name`                                                         | `artistID`                 |
| `createGenre`    | Adds a new genre to the database.                                                                                                                                                                                                                                                                                                                                                 | `albumID`, `genre`                                             | -                          |
| `deleteGenre`    | Deletes a genre entry from the database.                                                                                                                                                                                                                                                                                                                                          | `albumID`, `genre`                                             | -                          |
| `addCover`       | Adds a new cover to `coverFolder`, with the filename `albumID.ext`, and to `albumDirectory` (querying the database if none was supplied), with the filename `cover.ext`, according to `sourceType`. Updates database so that it points to `coverFolder/albumID.ext`.                                                                                                              | `source`, `sourcerType`,`albumID`, `albumDirectory (optional)` | -                          |
| `getLibrary`     | Gets all the albums that match `query` and `genre`. Also returns a small amount of matching tracks and all the genres in library.                                                                                                                                                                                                                                                 | `query`, `genre`                                               | `{albums, tracks, genres}` |
| `getAlbum`       | Gets all the info of an album, including genres, artist and tracks.                                                                                                                                                                                                                                                                                                               | `albumID`                                                      | `album`                    |
| `getAlbumTracks` | Gets the tracks mapped to `albumID`.                                                                                                                                                                                                                                                                                                                                              | `albumID`                                                      | `tracks`                   |

## Renderer process

### Events

A bunch of events are fired and listened withing the app. To facilitate their use, this class provides a simple way to use events. Importing Events should result in a static object with the following methods:

| Method   | Description                                                                          | Arguments                           | Return value |
|:-------- | ------------------------------------------------------------------------------------ |:-----------------------------------:|:------------:|
| `on`     | Adds an event listener to `event`. If `once`, `callback` should only be called once. | `event`, `callback`, `once = false` | `listenerID` |
| `fire`   | Calls the event listener(s) of `event`.                                              | `event`, `[args]`                   | -            |
| `remove` | Removes one event listener.                                                          | `listenerID`                        | -            |

### Shortcuts

Class that provides a very simple function to add shortcuts.

| Method   | Description                                                                                | Arguments                    | Return value |
| -------- | ------------------------------------------------------------------------------------------ |:----------------------------:|:------------:|
| `add`    | Adds a new shortcut to the app. Each keybinding is in the form `[ctrl+][shift+][alt+]key`. | `callback`, `...keybindings` | -            |
| `remove` | Removes the given `keybindings`.                                                           | `...keybindings`             | -            |

### Controller

Class that manages the app. Data access, state managing and music playing are its most important functions. It is divided into two other classes: `Playback` and `StateManager`.

**Constructor**

```js
class Controller {
    constructor(setView, setPlayback, setLoading, setTheme, setTutorial) {
        ...
        this.playback = new Playback(...);
        this.stateManager = new StateManager(...);
        ...
    }
}
```

#### Playback

Class that controls what is playing, what will play next, what to pause, etc. Uses howlerjs.

**Constructor**

```js
class Playback {
    constructor(setPlayback) {
        ...
    }
}
```

**Methods**

| Name             | Description                                                                                                                                                                                       | Arguments                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |:-------------------------------------:|
| `start`          | Starts the playback of a new track, according to position.                                                                                                                                        | -                                     |
| `play`           | Continues the playback.                                                                                                                                                                           | -                                     |
| `pause`          | Pauses the playback.                                                                                                                                                                              | -                                     |
| `stop`           | Stops the playback and sets the properties of playback to their default value.                                                                                                                    | -                                     |
| `seekFwd`        | Advances playback 5 seconds.                                                                                                                                                                      | -                                     |
| `seekBwd`        | Retards playback 5 seconds.                                                                                                                                                                       | -                                     |
| `skipFwd`        | Increments position and plays the corresponding track. If all tracks in queue were played, position is set to the queue's length.                                                                 | -                                     |
| `skipBwd`        | If playing time is greater than 5 seconds, return to beginning of the track. If this condition is not true, decrements position and plays the corresponding track.                                | -                                     |
| `setProgress`    | Sets the music progress to the percentage given in the argument.                                                                                                                                  | `progress`                            |
| `playTracks`     | Immediately stops current playback and plays the supplied list of tracks. Tracks that played previously are to be kept in the queue.                                                              | `tracks`                              |
| `addNext`        | Adds the supplied list of tracks to the queue, right next to the currently playing one.                                                                                                           | `tracks`                              |
| `addToQueue`     | Adds the supplied list of tracks to the end of the queue.                                                                                                                                         | `tracks`                              |
| `getTracks`      | Gets tracks according to the `sourceType` (`albumID`, `track`, `tracks`) and the `detail` (either an integer or a list of integers) and forwards them to `playTracks`, `addNext` or `addToQueue`. | `sourceType`, `detail`, `destination` |
| `updatePlayback` | Updates the state of elements depending on playback.                                                                                                                                              | -                                     |

`Playback` should set up event listeners for `play`, `pause`, `stop`, `seekFwd`, `seekBwd`, `skipFwd`, `skipBwd`, `setProgress` and `getTracks`.

#### StateManager

Class that controls the state and visual appearance of various app components.

**Constructor**

```js
class StateManager {
    constructor (setView, setLoading, setTheme, setTutorial) {
        ...
    }
}
```

**Methods**

| Name                | Description                                                                                                                               | Arguments                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |:--------------------------------------:|
| `setView`           | Sets the app view to `view`. If `view == albumDetails`, updates `viewingAlbumID` to `albumID`.                                            | `view`, `albumID = 0`                  |
| `getLibrary`        | Gets the library according to `searchParameters` and passes them to `setLibrary`.                                                         | `searchParameters`, `setLibrary`       |
| `getAlbumDetails`   | Gets the details of the album that matches `viewingAlbumID` and calls `setDetails` with them.                                             | `setDetails`                           |
| `getSettings`       | Gets the current settings and passes them on to `setSettings`.                                                                            | `setSettings`                          |
| `setSettings`       | Sets the provided settings and makes the necessary changes to the app. `firstTime` should always be saved as false.                       | `settings`                             |
| `implementSettings` | Make the necessary changes to the app so that it fits current `settings`.                                                                 | `settings`                             |
| `resetSettings`     | Restores settings to their original value.                                                                                                | `setSettings`                          |
| `open`              | Calls the main process' `open` handler and refreshes the library after it.                                                                | `setLibrary`                           |
| `addCover`          | Calls the main process' `addCover` handler and refreshes the component that called it according to `caller` (`albumDetails` or `ibrary`). | `albumID`, `caller`, `updateComponent` |
| `deleteAlbum`       | Calls the main process' `deleteAlbum` handler and refreshes the library after it.                                                         | `albumID`, `setLibrary`                |
| `addGenre`          | Adds a genre to an album and updates the `AlbumDetails` component.                                                                        | `genre`, `albumID`, `setDetails`       |
| `deleteGenre`       | Deletes a genre from an album and updates the `AlbumDetails` component.                                                                   | `genre`, `albumID`, `setDetails`       |
| `windowButton`      | Calls the main process's `windowButton` handler                                                                                           | `button`                               |
| `displayTutorial`   | Displays an introductory tutorial.                                                                                                        | -                                      |
| `resetLibrary`      | Deletes the database.                                                                                                                     | -                                      |

`StateManager` should set up event listeners for `setView`, `getLibrary`, `getAlbumDetails`, `getSettings`, `setSettings`, `open`, `addCover`, `deleteAlbum`, `addGenre`, `deleteGenre`, `windowButton`, `resetLibrary` and `resetSettings`.

### App

This is the main component. It stores a series of states and renders four views (`Library`, `Settings`, `AlbumDetails` and `Queue`) according to `view`. It also renders a `ContextMenu`, a spinner if `loading` and a `Tutorial` if `tutorial`.

**States**

The `App` component sets up four states: `view`, `playback`, `loading`, and `theme`.

```js
const [view, setView] = useState('library');

// Info about what is playing and the queue
const [playback, setPlayback] = useState({
    album: {}, // Object that stores info about the playing album
    track: {}, // Object that stores info about the playing track
    queue: [], // Array of tracks in queue
    position: 0, // Index of the playing track in queue
    progress: () => 0, // Returns a value between 0 and 1
    playing: () => false // Is playback playing or paused?
});

// Controlls whether a spinner should be shown
const [loading, setLoading] = useState(false);

// Controlls which class should be added to the App component
const [theme, setTheme] = useState('dark');

// Controlls whether a tutorial should be shown
const [tutorial, setTutorial] = useState(false);

const controller = useMemo(
    new Controller(setView, setPlayback, setLoading, setTheme, setTutorial)
);
```

### Library

Component rendered inside the `App`, displaying a `SearchBox`, library albums, a `TrackList` that matches search parameters and a `ControllArea`. Accepts `playback` as property.

**States**

The library sets up one state, `library`, which contains information about what should be displayed, according to the following structure:

```js
// Info about what should be displayed in the library component
const [library, setLibrary] = useState({
    searchParameters: {
        query: '',
        genre: ''
    },
    albums: [], // Array of albums that match the search parameters
    tracks: [], // Array of tracks that match the search parameters
    genres: [] // Array of all genres in library 
});
```

`setLibrary` should be passed to the controller component upon mounting.

### AlbumDetails

Component rendered inside the `App`, displaying an album's details such as `Cover`, `TrackList` and artist. Also has a `ControllArea`. Accepts `playback` as property.

**States**

Only one state is set up: `details`, containing all the information to be displayed.

```js
// Info about what should be displayed in the AlbumDetails component
const [details, setDetails] = useState({
    album: {}, // Generic album info
    tracks: [], // List of album tracks
});
```

`setDetails` should be passed to the controller component upon mounting

### Queue

Component rendered inside the `App`, containing a `ControllArea` and the queue. It is called with a single property, `playback`. 

**States**

A single state is set up, `active`, which is used to track user inactivity. Whenever `active` is `false`, an `inactive` class should be added to the rendered element.

```js
// Variable used to track user inactivity
const [active, setActive] = useState(true);
```

### Settings

Component that displays current settings, using the `Setting` component, and allows to modify them. The settings `customCSS` and `firstTime` should not be displayed nor modified, and the new settings should be saved automatically. This component should also allow to reset the settings, reset the library and to go through the tutorial again.

**States**

A single state is set up, `settings`, an object that contains the current settings. `setSettings` should be passed to the controller.

```js
// Variable that stores current settings
const [settings, setSettings] = useState({});
```

### Header

Component that displays the app's header bar, with app navigation utilities and window buttons. Specifically, people should be able to access `library`, `settings` and open files (if a `setLibrary` function is provided), as well as the normal three window control buttons.

### ControllArea

Component that displays information about the currently playing track (cover, name and album), and allows to seek, pause, play, skip forward and skip backward. Is called with the argument `playback`. An optional property `dummy` prevents all events from being fired.

### Cover

Component that displays an album cover, given an `album` object. Also accepts an argument `buttons` (defaulting to `[]`) with a list of buttons to display on cover (`play` for playing the album and `details` for a detailed album view) and a `setLibrary` function, to pass as argument when album is deleted. Right clicking on the album should bring up a context menu with the following options: `playAlbum`, `addAlbumToQueue`, `albumDetail`, `addCover` and `deleteAlbum`.

### ContextMenu

Component that renders a context menu on a given `position`, showing it whenever it is `visible`. The same file should also give access to a function, `addContextMenu`, which allows to set the states of `ContextMenu`. Please note that the component should be designed in such a way that it is called only once. Furthermore, the `items` that are passed onto `addContextMenu` should be an array dictionaries with entries `text` and `onClick`.

**States**

Three states are set up by this component: `items`, `positions` and `visibility`.

```js
// Which items are to be displayed in the context menu
const [items, setItems] = useState([]);
// The coordinates of the context menu
const [position, setPosition] = useState({x:0, y:0});
// Whether the context menu should be shown
const [visible, setVisibility] = useState(false);
```

### SearchBox

Component that allows users to type in a `query` and choose one `genre` filter. Accepts `searchParameters`, `genres` (all the genres in the database) and `setLibrary` as properties.

### TrackList

Displays a list of tracks, accepting `tracks`, `playback` and `displayCDs`. This last variable specifies whether a separator indicating a different CD from the same album should be introduced.

### Track

Component that displays a single track, called with the properties `track`, `classes` and `playing`, `tracksToPlay`. The component should display the track number and name, and also a sprite if it is the currently playing track. The last property specifies which tracks should be played if this track is clicked (in a CD, for instance, you want the user to be able choose a track and play all the ones that come after it). An optional property `dummy` should prevent all events from being fired.

### Setting

Component that displays a single `setting`. Its properties are `setting` and `modify`. In order to modify the setting, `modify` should be called. The value to be passed to the function is the entire setting. Here is an example:

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

### Tutorial

Component that renders a brief introductory tutorial, based on a series of slides. Its single property is `setTutorial`.

### Genre

Component that renders a single genre tag. Its arguments are `genre` and `deleteButton`. In case `deleteButton` is not undefined, an option should be added to remove the genre, triggering the `deleteButton` function.

### ProgressBar

Component that, given a `getProgress` function, sets up a progress bar that regularly updates. Furthermore, allows to set the a new position firing the `setProgress` event. An optional property `dummy` prevents all events from being fired.

### Button

Wrapper class that builds a button around its children. Also accepts `onClick`, `type` (`box`, `round`, `nodecor`, defaulting to `box`) and `shortcuts` as properties. Should be used as follows:

```jsx
<Button onClick={onClick}>
    {buttonContents}
</Button>
```

### SearchDummie

Component that implements a dummy search box.

### Icons

Module that contains a series of icons used throughout the app. Each of the icons accepts a property `size` defaulting to 32. It includes the following items:

- Logo

- Play

- Pause

- SkipFwd

- SkipBwd

- Settings

- Square

- Plus

- Circle

- CircleOutline

- List

- CD

- Search

- Back

- Queue

- Close

TODO: Implement auto-updates

**Main color:** #0b5c88

**Secondary 1:** #88280b

**Secondary 2:** #a08403

0.2: Personalização de cores

0.2: Shortcuts

0.2: Error handling

0.2 Playlist
