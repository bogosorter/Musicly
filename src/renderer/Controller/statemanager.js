import Events from 'renderer/Events/Events';

export default class StateManager {
    constructor(setView, setLibrary, setAlbumDetails, setSettings, setPlayback, setLoading, addLog) {
        this.setView = setView;
        this.setLibrary = setLibrary;
        this.setAlbumDetails = setAlbumDetails;
        this.setSettings = setSettings;
        this.setLoading = setLoading;
        this.log = addLog;

        // Apply settings
        ipcRenderer.invoke('getSettings').then(settings => {            
            // implementSettings is not called directly to ensure that firstTime
            // is saved as false
            this.saveSettings(settings);
        });

        // `StateManager` should set up event listeners for `changeView`,
        // `getLibrary`, `saveSettings`, `resetSettings`, `open`, `addCover`,
        // `deleteAlbum`, `updateAlbumInfo`, `windowButton`, `resetLibrary`,
        // `resetSettings` and `log`. In addition, `log` should also be listened
        // on `ipcRenderer`.
        Events.on('changeView', this.changeView.bind(this));
        Events.on('getLibrary', this.getLibrary.bind(this));
        Events.on('saveSettings', this.saveSettings.bind(this));
        Events.on('resetSettings', this.resetSettings.bind(this));
        Events.on('open', this.open.bind(this));
        Events.on('addCover', this.addCover.bind(this));
        Events.on('deleteAlbum', this.deleteAlbum.bind(this));
        Events.on('updateAlbumInfo', this.updateAlbumInfo.bind(this));
        Events.on('updateTrackInfo', this.updateTrackInfo.bind(this));
        Events.on('windowButton', this.windowButton.bind(this));
        Events.on('resetLibrary', this.resetLibrary.bind(this));
        Events.on('log', this.log.bind(this));
        ipcRenderer.on('log', (e, message) => this.log(message));

        this.getLibrary();

        // Check for updates
        ipcRenderer.invoke('checkForUpdates').then(update => {
            if (update) this.log({type: 'success', message: 'An update is available!'});
        });
    }

    /**
     * Sets the app view to `view`, updating album details if needed, according
     * to albumID. Should call the main processes's `setMiniPlayer` if `view ==
     * miniplayer`.
     * @param {string} view 
     * @param {int} albumID 
     */
    async changeView(view, albumID = 0) {
        if (view == 'albumDetails') {
            const album = await ipcRenderer.invoke('getAlbum', albumID);
            const tracks = await ipcRenderer.invoke('getAlbumTracks', albumID);
            this.setAlbumDetails({album, tracks});
        } else if (view == 'miniplayer') {
            ipcRenderer.invoke('setMiniPlayer');
        } else if (view == 'library') {
            ipcRenderer.invoke('unsetMiniPlayer');
        }

        this.setView(view);
    }

    /**
     * Gets the library according to `searchParameters` and updates the
     * `Library` component.
     */
    async getLibrary(searchParameters = {query: '', genre: ''}) {
        let library = await ipcRenderer.invoke('getLibrary', searchParameters);
        library.searchParameters = searchParameters;
        this.setLibrary(library);
    }

    /**
     * Sets the provided settings and makes the necessary changes to the app.
     */
    saveSettings(settings) {
        this.implementSettings(settings);

        // First time is always saved as false
        ipcRenderer.invoke('setSettings', {...settings, firstTime: false});
    }

    /**
     * Adapts the app to the current `settings`.
     */
    implementSettings(settings) {   
        webFrame.setZoomFactor(parseFloat(settings.zoomFactor.value));

        // Remove custom css if there is any (prevents accumulating multiple css
        // elements if user has changed it various times)
        document.querySelector('#custom-css')?.remove();

        // Add custom css to page 
        const styleElement = document.createElement('style');
        styleElement.innerText = settings.customCSS.value;
        styleElement.id = 'custom-css';
        document.head.appendChild(styleElement);

        this.setSettings(settings);
    }

    /**
     * Restores settings to their original value.
     */
    async resetSettings() {
        await ipcRenderer.invoke('resetSettings');
        const settings = await ipcRenderer.invoke('getSettings');
        this.implementSettings(settings);
    }

    /**
     * Calls the main process' `open` handler and refreshes the library after
     * it.
     */
    async open(type = 'folder') {
        // Add a progress spinner
        this.setLoading(true);
        await ipcRenderer.invoke('open', type);
        this.getLibrary();
        // Remove the spinner
        this.setLoading(false);
    }

    /**
     * Calls the main process' `addCover` handler and refreshes the component
     * that called it according to `caller`.
     */
    async addCover(albumID, caller) {
        // Add a progress spinner
        this.setLoading(true);
        await ipcRenderer.invoke('addCover', albumID);

        // Update covers everywhere
        const album = await ipcRenderer.invoke('getAlbum', albumID);
        const tracks = await ipcRenderer.invoke('getAlbumTracks', albumID);
        this.setAlbumDetails({album, tracks});
        this.getLibrary();
        
        this.setLoading(false);
    }

    /**
     * Calls the main process' `deleteAlbum` handler and refreshes the library
     * after it.
     */
    async deleteAlbum(albumID) {
        // Add a progress spinner
        this.setLoading(true);
        await ipcRenderer.invoke('deleteAlbum', albumID);
        this.getLibrary();
        // Remove the spinner
        this.setLoading(false);
    }

    /**
     * Calls the main process' `updateAlbumInfo` handler and refreshes the
     * `AlbumDetails` component.
     */
    async updateAlbumInfo(albumID, albumInfo) {
        // Add a progress spinner
        this.setLoading(true);
        await ipcRenderer.invoke('updateAlbumInfo', albumID, albumInfo);
        this.getLibrary();
        this.setLoading(false);
        
        this.changeView('albumDetails', albumID);
    }

    /**
     * Calls the main process' `updateTrackInfo` handler and refreshes the
     * `AlbumDetails` component.
     */
     async updateTrackInfo(albumID, trackID, trackInfo) {
        // Add a progress spinner
        this.setLoading(true);
        await ipcRenderer.invoke('updateTrackInfo', trackID, trackInfo);
        this.getLibrary();
        this.setLoading(false);
        
        this.changeView('albumDetails', albumID);
    }


    /**
     * Calls the main process' `windowButton` handler 
     */
    windowButton(button) {
        ipcRenderer.invoke('windowButton', button);
    }

    /**
     * Deletes the database.
     */
    async resetLibrary() {
        await ipcRenderer.invoke('resetLibrary');
        this.getLibrary();
    }
}