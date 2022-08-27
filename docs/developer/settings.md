---
permalink: /docs/dev/settings
layout: docs
title: Settings
---

# Settings

{:.no_toc}

## Table of contents

{:.no_toc}

* TOC
  {:toc}

## The Settings class

Class that manages app settings.

### Methods

#### `get`

**Description:** Gets app settings. If none are defined, returns default settings.

**Arguments:** None

**Return value:** `settings`

#### `set`

**Description:** Store the provided `settings`.

**Arguments:** `settings`

**Return value:** None

#### `reset`

**Description:** Stores the predefined settings.

**Arguments:** None

**Return value:** None

#### `getCustomCSS`

**Description:** Auxiliary method that gets the user-defined CSS, returning `''` if there is no corresponding file.

**Arguments:** None

**Return value:** `customCSS`

#### `setCustomCSS`

**Description:** Auxiliary method that saves the user-defined CSS.

**Arguments:** `customCSS`

**Return value:** None

## Structure

The settings are stored in an object containing `subSettings`. These, in turn, have a property `type` which determines what the other properties are and what should be displayed in the `Setting` component. While `customCSS` and `firstTime` are included in the settings structure, they are not conventional. `firstTime` is only `true` on the first time the app is opened and `customCSS` is store in `customCSSPath`. To retrieve it, use the `getCustomCSS` function.

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

## Paths

The paths used by the `Settings` class are these:

- `settingsPath = [userData]/settings.json`

- `customCSSPath = [userData]/css/custom.css`