---
permalink: /docs/dev/events
layout: docs
title: Events
---



# Events
{:.no_toc}

## Table of contents
{:.no_toc}

* TOC
{:toc}

## The Events class

A bunch of events are fired and handled within the app. To facilitate their use, this class provides a simple way to use events. Importing `Events` should result in a static object with the following methods:

### Methods

#### `on`

**Description:** Adds an event listener to `event`. If `once`, `callback` should only be called once.

**Arguments:** `event`, `callback`, `once = false`

**Return Value:** `listenerID`

#### `fire`

**Description:** Calls the event listener(s) of `event`.

**Arguments:** `event`, `[...args]`

**Return Value:** None

#### `remove`

**Description:** Removes one event listener

**Arguments:** `listenerID`

**Return Value:** None