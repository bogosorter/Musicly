---
permalink: /docs/dev
layout: docs
title: Developer documentation
---

# Developer documentation
{:.no_toc}

## Table of contents
{:.no_toc}

* TOC
{:toc}

## A couple remarks

I'm not a seasoned programmer. In fact, my journey in programming started about two years ago, in a somewhat unstable way. A couple courses, YouTube videos, etc. Therefore, my code isn't great. You should expect to find some errors, and a lot of bad practices. I have, though, made some effort to write clean and understandable code, forcing myself to write a lot of comments (to many?) and to make a structured project (actually the first complete one).

This explains how this project came to be. Given that I'm inexperienced, I would appreciate any kind of feedback: pull requests, issues, comments or just a thumbs-up!

I hope you get as exited with this project as I did.

*Final note: My English isn't great.*

M7kra

## Installing and Building

In order to download the source code, run the following command:

```bash
git clone https://github.com/m7kra/Musicly.git
npm install
```

You may then build with `npm run package`.

## Structure

Musicly is based on [Electron](https://www.electronjs.org/) and [React](https://reactjs.org/), put together with [Electron React Boilerplate](https://electron-react-boilerplate.js.org/). Following the structure defined by Electron React Boilerplate, the app is divided into two processes: main, which deals with databases, settings and getting the app up and running, and renderer, responsible for the UI and music playback. The two processes communicate using Electron's [IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) (Inter-Process Communication).

### Main Process

Part of the program that interacts with the file system (creating a database, storing settings and covers) and with the OS (creating and destroying windows, resizing them, etc.).

Three helper modules are defined:

- [`DB`](/Musicly/docs/dev/db): Manages the database. 

- [`Settings`](/Musicly/docs/dev/settings): Gets and sets the user settings.

- `utilities`: Provides utilities for window management.

These are managed by the [`main.js`](/Musicly/docs/dev/main) script which also handles `ipcMain` events.

### Renderer Process

Part of the program that displays the UI and manages the music playback. The helper modules and components were designed with a VMC structure in mind. I suspect, however, that this failed :). These are its different pieces:

- [`Events`](/Musicly/docs/dev/events): A helper module that eases sending and handling of events within the app.

- [`Shortcuts`](/Musicly/docs/dev/shortcuts): A helper module that allows to easily set up and remove app shortcuts.

- [`Controller`](/Musicly/docs/dev/controller): The working horse of the renderer process, this module communicates with the main process, manages music playback and the application's state.

- [`Components`](/Musicly/docs/dev/components): A bunch of React functional components, of which `App` is the main one, rendering all the others and calling the `Controller`.

## Next steps

These are a couple things that I'm planning to add to the app later on:

- Queue management (for now, you can only see which tracks are going to play next).

- Genre management (everything needed for this is implemented, except the UI).