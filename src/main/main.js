import createWindow from './utils';
import DB from './DB/DB';
import Settings from './Settings/Settings';
import { app, ipcMain, dialog, powerSaveBlocker } from 'electron';

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
    console.log('blockID:')
    console.log(blockID);
    if (blockID != undefined) {
        console.log('unblocking');
        powerSaveBlocker.stop(blockID);
    }
}

ipcMain.handle('open', (e, dialogType) => open(dialogType));
ipcMain.handle('addCover', (e, albumID) => addCover(albumID));
ipcMain.handle('windowButton', (e, button) => windowButton(button));
ipcMain.handle('getLibrary', (e, searchParameters) => db.getLibrary(searchParameters));
ipcMain.handle('getAlbum', (e, albumID) => db.getAlbum(albumID));
ipcMain.handle('getAlbumTracks', (e, albumID) => db.getAlbumTracks(albumID));
ipcMain.handle('getSettings', Settings.get);
ipcMain.handle('setSettings', (e, settings) => Settings.set(settings));
ipcMain.handle('resetSettings', () => Settings.reset());
ipcMain.handle('deleteAlbum', (e, albumID) => db.deleteAlbum(albumID));
ipcMain.handle('resetLibrary', resetLibrary);
ipcMain.handle('blockSleep', () => blockSleep());
ipcMain.handle('unblockSleep', () => unblockSleep());

// Handle exceptions
process.on('uncaughtException', (err) => {
    const error = {
        type: 'error',
        title: 'An error occured',
        message: 'Try to restart Musicly and, if the error persists, please contact me at https://github.com/m7kra/Musicly/issues or inboxaljezur@gmail.com, with the following error: ' + err.message
    };
    dialog.showMessageBoxSync(error);
    app.exit(1);
})