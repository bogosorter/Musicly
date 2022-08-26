---
permalink: /docs/dev/shortcuts
layout: docs
title: Shortcuts
---



# Shortcuts
{:.no_toc}

## Table of contents
{:.no_toc}

- TOC
{:toc}

## The Shortcuts class

A helper module that allow to easily set up and remove app shortcuts. Please note that keybindings should be in the form `[ctrl+][shift+][alt+]key`.

### Methods

#### `add`

**Description:** Adds a new shortcut to the app.

**Arguments:** `callback`, `...keybindings`

**Return value:** None

#### `remove`

**Description:** Removes the given `keybindings`.

**Arguments:** `...keybindings`

**Return value:** None