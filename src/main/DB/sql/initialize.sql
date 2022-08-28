CREATE TABLE albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    directory TEXT,
    artistID INTEGER,
    discCount INTEGER,
    coverPath TEXT
);
CREATE TABLE tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    composer TEXT,
    albumID INTEGER,
    trackOrder INTEGER,
    disc INTEGER,
    path TEXT
);
CREATE TABLE artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);
CREATE TABLE genres (
    albumID INTEGER,
    genre TEXT,
    UNIQUE(albumID, genre)
);