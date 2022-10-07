---
permalink: /docs/dev/main
layout: docs
title: Main
---

# Main
{:.no_toc}

## Table of contents
{:.no_toc}

* TOC
{:toc}

## General

The main script puts together all the logic in the main process. It initializes the app and creates a `BrowserWindow` (only one instance being allowed). Creates instances of Settings and DB and handles a bunch of channels in `ipcMain`:

## `ipcMain` channels

### `open`

**Description:** Calls `showOpenDialogSync` and adds the resulting folders/files to the library.

**Arguments:** `dialogType` (`folder` or `file`)

**Return value:** None

### `addCover`

**Description:** Asks for the path to the new cover and adds the cover to the library.

**Arguments:** `albumID`

**Return value:** None

#### `createGenre`

**Description:** Adds a new genre to the database.

**Arguments:** `albumID`, `genre`

**Return value:** None

#### `deleteGenre`

**Description:** Deletes an entry from the `genres` table.

**Arguments:** `albumID`, `genre`

**Return value:** None

### `windowButton`

**Description:** Resizes and closes the window according to the button pressed.

**Arguments:** `button` (`maximize`, `minimize` or `close`)

**Return value:** None

### `getLibrary`

**Description:** Gets all the albums that match `query` and `genre`. Also returns a small amount of matching tracks. If `genre` is an empty string, gets all the genres in library.

**Arguments:** `searchParameters`

**Return value:** `{albums, tracks, genres}`

### `getAlbum`

**Description:** Gets all the info of an album, including genres, artist and tracks.

**Arguments:** `albumID`

**Return value:** `album`

### `getAlbumTracks`

**Description:** Gets the tracks mapped to `albumID`.

**Arguments:** `albumID`

**Return value:** `tracks`

### `getSettings`

**Description:** Gets app settings. If none are defined, return default settings.

**Arguments:** None

**Return value:** `settings`

### `setSettings`

**Description:** Store the provided `settings`.

**Arguments:** None

**Return value:** None

### `resetSettings`

**Description:** Reset settings to their default value.

**Arguments:** None

**Return value:** None

### `resetLibrary`

**Description:** Deletes the database and creates a new one.

**Arguments:** None

**Return value:** None

### `blockSleep`

**Description:** Prevents the PC from going to sleep.

**Arguments:** None

**Return Value:** None

### `unblockSleep`

**Description:** Removes the current sleep block.

**Arguments:** None

**Return Value:** None

### `setMiniPlayer`

**Description:** Does the main-side preparations for the mini-player mode, i.e., changes the window size, sets it to be always on top and moves it to the lower right corner.

**Arguments:** None

**Return Value:** None

### `unsetMiniPlayer`

**Description:** Undoes the main-side preparations for the mini-player mode.

**Arguments:** None

**Return Value:** None

## `checkForUpdates`

**Description:** Checks for existing updates on Github releases, returning true if there are any.

**Arguments:** None

**Return Value:** `updates`
