import Events from 'renderer/Events/Events';
import { log } from 'renderer/Components/Logger/Logger';

export default class StateManager {
    constructor(setView, setLoading, setTheme, setTutorial) {
        this.setViewInApp = setView;
        this.setLoading = setLoading;
        this.setTheme = setTheme;
        this.setTutorial = setTutorial;

        // Apply settings
        ipcRenderer.invoke('getSettings').then(settings => {            
            // implementSettings is not called directly to ensure that firstTime
            // is saved as false
            this.setSettings(settings);
        });
        console.log(ipcRenderer);
        ipcRenderer.on('log', (e, message) => log(message));

        // `StateManager` should set up event listeners for `setView`,
        // `getLibrary`, `getAlbumDetails`, `getSettings`, `setSettings`,
        
        // `open`, `addCover`, `deleteAlbum`, `addGenre`, `deleteGenre`,
        // `windowButton`.
        Events.on('setView', this.setView.bind(this));
        Events.on('getLibrary', this.getLibrary.bind(this));
        Events.on('getAlbumDetails', this.getAlbumDetails.bind(this));
        Events.on('getSettings', this.getSettings.bind(this));
        Events.on('setSettings', this.setSettings.bind(this));
        Events.on('resetSettings', this.resetSettings.bind(this));
        Events.on('open', this.open.bind(this));
        Events.on('addCover', this.addCover.bind(this));
        Events.on('deleteAlbum', this.deleteAlbum.bind(this));
        Events.on('addGenre', this.addGenre.bind(this));
        Events.on('deleteGenre', this.deleteGenre.bind(this));
        Events.on('windowButton', this.windowButton.bind(this));
        Events.on('displayTutorial', this.displayTutorial.bind(this));
        Events.on('resetLibrary', this.resetLibrary.bind(this));
        Events.on('log', (message) => log(message));
    }

    /**
     * Sets the app view to `view`. If `view == albumDetails`, updates
     * `viewingAlbumID` to `albumID`.
     * @param {string} view 
     * @param {int} albumID 
     */
    setView(view, albumID = 0) {
        if (view == 'albumDetails') this.viewingAlbumID = albumID;
        this.setViewInApp(view);
    }

    /**
     * Gets the library according to `searchParameters` and passes them to
     * `setLibrary`.
     */
     async getLibrary(searchParameters, setLibrary) {
        let library = await ipcRenderer.invoke('getLibrary', searchParameters);
        library.searchParameters = searchParameters;
        setLibrary(library);
    }

    /**
     * Gets the details of the album that matches `viewingAlbumID` and calls
     * `setDetails` with them.
     */
    async getAlbumDetails(setDetails) {
        const album = await ipcRenderer.invoke('getAlbum', this.viewingAlbumID);
        const tracks = await ipcRenderer.invoke('getAlbumTracks', this.viewingAlbumID);
        setDetails({album, tracks});
    }

    /**
     * Gets the current settings and passes them on to `setSettings`.
     */
     async getSettings(setSettings) {
        const settings = await ipcRenderer.invoke('getSettings');
        this.implementSettings(settings);
        setSettings(settings);
    }

    /**
     * Sets the provided settings and makes the necessary changes to the app.
     */
    setSettings(settings) {

        // Ensure that zoom factor as a reasonable value (in order to prevent
        // user error)
        settings.zoomFactor.value = Math.min(2, Math.max(0.5, settings.zoomFactor.value));

        this.implementSettings(settings);

        // First time is always saved as false
        settings.firstTime = false;
        ipcRenderer.invoke('setSettings', settings);
    }

    /**
     * Make the necessary changes to the app so that it fits current `settings`.
     * If `displayTutorial`, this setting should be set to false after the
     * tutorial component finishes.
     */
    implementSettings(settings) {
        this.setTheme(settings.theme.value);

        webFrame.setZoomFactor(settings.zoomFactor.value);

        // Remove custom css if there is any (prevents accumulating multiple css
        // elements if user has changed it various times)
        document.querySelector('#custom-css')?.remove();

        // Add custom css to page 
        const styleElement = document.createElement('style');
        styleElement.innerText = settings.customCSS.value;
        styleElement.id = 'custom-css';
        document.head.appendChild(styleElement);

        if (settings.firstTime) this.displayTutorial();

        window.settings = settings;
    }

    /**
     * Restores settings to their original value.
     */
    async resetSettings(setSettings) {
        await ipcRenderer.invoke('resetSettings');
        const settings = await ipcRenderer.invoke('getSettings');
        this.implementSettings(settings);
        setSettings(settings);
    }

    /**
     * Calls the main process' `open` handler and refreshes the library after
     * it.
     */
    async open(setLibrary) {
        // Add a progress spinner
        this.setLoading(true);
        await ipcRenderer.invoke('open');
        this.getLibrary({query: '', genre: ''}, setLibrary);
        // Remove the spinner
        this.setLoading(false);
    }

    /**
     * Calls the main process' `addCover` handler and refreshes the component
     * that called it according to `caller` (`albumDetails` or `ibrary`).
     */
    async addCover(albumID, caller, updateComponent) {
        // Add a progress spinner
        await ipcRenderer.invoke('addCover', albumID);
        if (caller == 'library') this.getLibrary({query: '', genre: ''}, updateComponent);
        else this.getAlbumDetails(updateComponent);
    }

    /**
     * Calls the main process' `deleteAlbum` handler and refreshes the library
     * after it.
     */
    async deleteAlbum(albumID, setLibrary) {
        // Add a progress spinner
        this.setLoading(true);
        await ipcRenderer.invoke('deleteAlbum', albumID);
        this.getLibrary({query: '', genre: ''}, setLibrary);
        // Remove the spinner
        this.setLoading(false);
    }

    /**
     * Adds a genre to an album and updates the `AlbumDetails` component.
     */
    async addGenre(genre, albumID, setDetails) {
        await ipcRenderer.invoke('addGenre', genre, albumID);
        this.getAlbumDetails(setDetails);
    }

    /**
     * Deletes a genre from an album and updates the `AlbumDetails` component.
     */
    async deleteGenre(genre, albumID, setDetails) {
        await ipcRenderer.invoke('deleteGenre', genre, albumID);
        this.getAlbumDetails(setDetails);
    }

    /**
     * Calls the main process' `windowButton` handler 
     */
    windowButton(button) {
        ipcRenderer.invoke('windowButton', button);
    }

    /**
     * Displays an introductory tutorial.
     */
    displayTutorial() {
        this.setTutorial(true);
    }

    /**
     * Deletes the database.
     */
    async resetLibrary() {
        await ipcRenderer.invoke('resetLibrary');
    }
}