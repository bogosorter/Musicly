import createWindow from './utils';
import DB from './DB/DB';
import Settings from './Settings/Settings';
import { app, ipcMain, dialog, powerSaveBlocker, screen } from 'electron';
import { platform } from 'os';
import versionCheck from 'github-version-checker';

const db = new DB();
db.init();
let mainWindow;

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady().then( async () => {
    mainWindow = await createWindow();
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) createWindow();
    });
}).catch(console.log);

/**
 * Calls `showOpenDialogSync` and adds the resulting files/folders to library.
 */
async function open(dialogType) {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: [dialogType == 'folder'? 'openDirectory' : 'openFile'],
    });
    for (const path of result.filePaths) await db.openPath(path);
}

/**
 * Adds a given path to the library.
 */
async function addFiles(files) {
    for (const file of files) await db.openPath(file);
}

/**
 * Retrieves the path to the new cover and adds the cover to the library.
 * @param {int} albumID 
 */
async function addCover(albumID) {
    const path = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: ['png', 'jpeg', 'jpg', 'jfif', 'webp', 'gif', 'svg', 'bmp', 'ico']
    });
    if (path.filePaths.length > 0) await db.addCover(path.filePaths[0], 'path', albumID);
}

/**
 * Deletes the database and creates a new one.
 */
async function resetLibrary() {
    await db.close();
    await db.delete();
    await db.init();
}

/**
 * Resizes and closes the window according to the button pressed.
 * @param {string} button 
 */
function windowButton(button) {
    switch (button) {
        case 'maximize':
            if (mainWindow.isMaximized()) mainWindow.unmaximize();
            else mainWindow.maximize();
            break;
        case 'minimize':
            mainWindow.minimize();
            break
        case 'close':
            mainWindow.close();
            break;
    }
}


let blockID;

/**
 * Prevents the PC from going to sleep.
 */
function blockSleep() {
    unblockSleep();
    blockID = powerSaveBlocker.start('prevent-display-sleep');
}

/**
 * Removes the current sleep block.
 */
function unblockSleep() {
    if (blockID != undefined) {
        powerSaveBlocker.stop(blockID);
    }
}

/**
 * **Description:** Does the main-side preparations for the mini-player mode,
 * i.e., changes the window size, sets it to be always on top and
 * moves it to the lower right corner.
 */
async function setMiniPlayer() {
    const size = (await Settings.get()).miniPlayerSize.value;
    let width = size == 'small'? 250 : size == 'medium'? 300 : 400;
    let height = size == 'small'? 60 : size == 'medium'? 70 : 90;
    // Adapt size for windows, which has 125% zoom factor
    if (platform() == 'win32') {
        width *= 0.8;
        height *= 0.8;
    }
    mainWindow.setFullScreen(false);
    mainWindow.unmaximize();
    mainWindow.setMinimumSize(width, height);
    mainWindow.setSize(width, height);
    mainWindow.setResizable(false);
    mainWindow.setFullScreenable(false);
    mainWindow.setAlwaysOnTop(true);
    const bounds = screen.getPrimaryDisplay().workArea;
    mainWindow.setPosition(bounds.width - width - 25, bounds.height - height - 20, false);
}

/**
 * Undoes the main-side preparations for the mini-player mode.
 */
function unsetMiniPlayer() {
    mainWindow.setResizable(true);
    mainWindow.setFullScreenable(true);
    mainWindow.maximize();
    mainWindow.setMinimumSize(800, 600);
    mainWindow.setAlwaysOnTop(false);
}

/**
 * Checks for existing updates on Github releases, returning true if there are any.
 */
async function checkForUpdates() {
    try {
        return await versionCheck({
            repo: 'Musicly',
            owner: 'm7kra',
            currentVersion: app.getVersion(),
        });
    } catch {
        // Probably failed due to internet connection
        return false;
    }
}

ipcMain.handle('open', (e, dialogType) => open(dialogType));
ipcMain.handle('addFiles', (e, path) => addFiles(path));
ipcMain.handle('addCover', (e, albumID) => addCover(albumID));
ipcMain.handle('windowButton', (e, button) => windowButton(button));
ipcMain.handle('getLibrary', (e, searchParameters) => db.getLibrary(searchParameters));
ipcMain.handle('getAlbum', (e, albumID) => db.getAlbum(albumID));
ipcMain.handle('getAlbumTracks', (e, albumID) => db.getAlbumTracks(albumID));
ipcMain.handle('updateAlbumInfo', (e, albumID, albumInfo) => db.updateAlbumInfo(albumID, albumInfo));
ipcMain.handle('updateTrackInfo', (e, trackID, trackInfo) => db.updateTrackInfo(trackID, trackInfo));
ipcMain.handle('getSettings', Settings.get);
ipcMain.handle('setSettings', (e, settings) => Settings.set(settings));
ipcMain.handle('resetSettings', () => Settings.reset());
ipcMain.handle('deleteAlbum', (e, albumID) => db.deleteAlbum(albumID));
ipcMain.handle('resetLibrary', resetLibrary);
ipcMain.handle('blockSleep', () => blockSleep());
ipcMain.handle('unblockSleep', () => unblockSleep());
ipcMain.handle('setMiniPlayer', () => setMiniPlayer());
ipcMain.handle('unsetMiniPlayer', () => unsetMiniPlayer());
ipcMain.handle('checkForUpdates', () => checkForUpdates());

// Handle exceptions
process.on('uncaughtException', (err) => {
    const error = {
        type: 'error',
        title: 'An error occured',
        message: 'Try to restart Musicly and, if the error persists, please contact me at https://github.com/m7kra/Musicly/issues or luiswbarbosa@gmail.com, with the following error: ' + err.message
    };
    dialog.showMessageBoxSync(error);
    app.exit(1);
});