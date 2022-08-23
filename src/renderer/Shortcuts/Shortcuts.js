const shortcuts = {};

export default class Shortcuts {

    /**
     * Adds a new shortcut to the app. Each keybinding is in the
     * form `[ctrl+][shift+][alt+]key`.
     * @param {function} callback 
     * @param  {...string} keybindings 
     */
    static add(callback, ...keybindings) {
        for (const keybinding of keybindings) {
            shortcuts[keybinding] = callback;
        }
    }

    /**
     * Removes the given `keybindings`.
     * @param  {...string} keybindings 
     */
    static remove(...keybindings) {
        for (const shortcut of keybindings) {
            delete shortcuts[shortcut];
        }
    }

}

/**
 * Checks if the key pressed corresponds to a shortcut and triggers it
 * @param {KeyboardEvent} event 
 */
function handleKeyDown(event) {

    // events dispatched on inputs are not valid
    if (event.target.tagName == 'INPUT') return;

    // Detect which keys were pressed
    const keys = [];
    if (event.ctrlKey) keys.push('ctrl');
    if (event.shiftKey) keys.push('shift');
    if (event.altKey) keys.push('alt');
    keys.push(event.key.toLowerCase());

    const shortcut = keys.join('+');

    // Trigger callback if there is any
    if (shortcut in shortcuts) {
        shortcuts[shortcut]();
        event.preventDefault();
    }
}
document.onkeydown = handleKeyDown;