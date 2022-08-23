import { contextBridge, ipcRenderer, IpcRendererEvent, webFrame } from 'electron';
import { Howl } from 'howler';
import { readFileSync } from 'fs';
import { extname } from 'path';

// This is an ugly fix :) It just turns out that when passing Howl to the
// renderer process, `this` somehow becomes very inadequate, and when Howl call
// `this.init` it is said to be undefined.
// I really don't know what's going on in here. Help apreciated!
function createHowl(o) {
    const howl = new Howl(o);
    return {
        play: () => howl.play(),
        pause: () => howl.pause(),
        playing: () => howl.playing(),
        seek: (time) => howl.seek(time),
        duration: () => howl.duration(),
        unload: () => howl.unload()
    };
}

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
contextBridge.exposeInMainWorld('Howl', (o) => createHowl(o));
contextBridge.exposeInMainWorld('webFrame', {
    setZoomFactor: (value) => webFrame.setZoomFactor(value)
});
contextBridge.exposeInMainWorld('fs', { readFileSync });
contextBridge.exposeInMainWorld('path', { extname });