import settings from 'electron-settings';
import fs from 'fs';
import { app } from 'electron';
import path from 'path';
import { platform } from 'os';

const customCSSDirectory = path.join(app.getPath('userData'), 'css');
const customCSSPath = path.join(app.getPath('userData'), 'css', 'custom.css');

/**
 * Class that manages app settings. Settings are represented as an array
 * containing `subSettings`. These, in turn, have a property `type` which
 * determines what the other properties are and what should be displayed in the
 * `Settings` component.
 */
export default class Settings {

    /**
     * Gets app settings. If none are defined, return default settings.
     * @return {Object} settings
     */
    static async get() {
        // Get the stored settings and decide whether to use the default ones
        const definedSettings = await settings.get()
        let result = defaultSettings;
        
        if (Object.keys(definedSettings).length > 1) result = definedSettings;

        // Add custom CSS
        const customCSS = Settings.getCustomCss();
        result.customCSS = defaultSettings.customCSS;
        result.customCSS.value = customCSS;
        
        return result;
    }

    /**
     * Store the provided `settings`
     * @param {Object} settings 
     */
    static async set(newSettings) {
        // Store CSS
        if (newSettings.customCSS) {
            Settings.setCustomCss(newSettings.customCSS.value);
            delete newSettings.customCSS;
        }

        await settings.set(newSettings);
    }

    /**
     * Stores the predefined settings.
     */
    static async reset() {
        // firstTime is never saved as true
        const temp = {...defaultSettings};
        temp.firstTime = false;
        await settings.set(temp);
        this.setCustomCss('');
    }

    /**
     * Gets the user-defined CSS, returning `''` if none is defined.
     * @return {string} CSS
     */
    static getCustomCss() {
        if (!fs.existsSync(customCSSPath)) return '';
        else return fs.readFileSync(customCSSPath).toString();
    }

    /**
     * Auxiliary method that saves the user-defined CSS.
     * @param {string} customCSS 
     */
    static setCustomCss(customCSS) {
        // Create directory if it doesn't exist
        if (!fs.existsSync(customCSSDirectory)) fs.mkdirSync(customCSSDirectory);

        fs.writeFileSync(customCSSPath, customCSS);
    }
}

const defaultSettings = {
    theme: {
        name: 'Theme',
        type: 'select',
        options: ['light', 'dark'],
        value: 'dark'
    },
    zoomFactor: {
        name: 'Zoom',
        type: 'select',
        options: ['0.7', '0.8', '0.9', '1', '1.2', '1.4', '1.6', '1.8'],
        value: platform() == 'win32'? '0.8' : '1'
    },
    inactiveTime: {
        name: 'How many minutes before inactivity?',
        type: 'select',
        options: ['0.5', '1', '2', '3', '4', '5'],
        value: '3'
    },
    customCSS: {
        name: 'Custom CSS',
        type: 'code',
        language: 'css',
        value: '',
    },
    firstTime: true
}