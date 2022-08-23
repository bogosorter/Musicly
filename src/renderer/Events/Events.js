// Keeps track of event listeners
let eventListeners = {}
let id = 0

export default class Events {
    
    /**
     * Adds an event listener to `event`. If `once`, `callback` should only be
     * called once.
     * @param {string} event 
     * @param {function} callback 
     * @param {bool} once
     * @returns {int} listenerID
     */
    static on(event, callback, once = false) {
        // Initialize array if there is no event listener
        if (!(event in eventListeners)) {
            eventListeners[event] = [];
        }

        id += 1;

        // Add the new event listener
        eventListeners[event].push({
            id: 0,
            callback,
            once
        });
        return id;
    }

    /**
     * Calls the event listener(s) of `event`.
     * @param {string} event 
     * @param  {...any} args
     */
    static fire(event, ...args) {
        if (!(event in eventListeners)) return;
        for (const listener of eventListeners[event]) {
            listener.callback(...args);
        }
    }

    /**
     * Removes one event listener.
     * @param {int} listenerID
     */
    static remove(listenerID) {
        outerloop:
        for (let event in eventListeners) {
            for (let i = 0; i < eventListeners[event].length; i++) {
                if (eventListeners[event][i].id == listenerID) {
                    eventListeners[event].splice(i, 1);
                    break outerloop;
                }
            }
        }
    }
}