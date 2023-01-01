import { Circle } from 'react-bootstrap-icons';

import { useEffect } from 'react';
import Events from 'renderer/Events/Events';
import './progressbar.css';

/**
 * Component that, given a `getProgress` function, sets up a progress bar that
 * regularly updates. Furthermore, allows to set the a new position firing the
 * `setProgress` event. An optional property `dummy` prevents all events from
 * being fired.
 */

// New rerenderings should be able to delete the previous timeouts
let timeoutId;

export default function ProgressBar({getProgress, dummy = false}) {
    
    // Clear previous timeouts
    if (timeoutId) clearTimeout(timeoutId);

    let dragging = false;
    // Variables that are used frequently while updating the progress bar
    let progressBarBackground;
    let progressBarFill;

    // Function that regularly updates the progress bar
    function updateProgress() {
        // The progress bar should not move if user is currently dragging it.
        if (!dragging) displayProgress(getProgress());

        // Update next time in .25s
        clearTimeout(timeoutId);
        if (!dummy) timeoutId = setTimeout(updateProgress, 250);
    }

    // Function that changes the progress bar to the relative location of the
    // event and changes the actual music position if `save` is set to `true`
    function setProgress(e, save) {
        // Get progress from the relative position of the event
        const box = progressBarBackground.getBoundingClientRect();
        let progress = (e.clientX - box.left) / box.width;
        // Users may drag to the outside of the bar
        progress = Math.max(0, Math.min(1, progress));

        // Change the music position
        if (save && !dummy) Events.fire('setProgress', progress);
        displayProgress(progress);
    }


    // Function that sets the progress bar to a given `progress`
    function displayProgress(progress) {
        progressBarFill.style.width = `calc(${progress * 100}% - 7px)`;
    }

    useEffect(() => {

        // Assign references to progress bar elements
        progressBarBackground = document.querySelector('#progress-bar-background');
        progressBarFill = document.querySelector('#progress-bar-fill');

        // List for `click` and `drag` events on progress bar

        // All clicks in the progress bar container should be detected
        let progressBarContainer = document.querySelector('#progress-bar-container');
        progressBarContainer.addEventListener('click', (e) => setProgress(e, true));

        // The bar's button is draggable
        let progressBarButton = document.querySelector('#progress-bar-button');
        progressBarButton.addEventListener('dragstart', (e) => {
            dragging = true;
            // Remove the ugly looking :) drag image
            // https://stackoverflow.com/questions/38655964/how-to-remove-dragghost-image
            var img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            e.dataTransfer.setDragImage(img, 0, 0);
        });
        progressBarButton.addEventListener('drag', (e) => setProgress(e, false));
        progressBarButton.addEventListener('dragend', (e) => {
            dragging = false;
            setProgress(e, true);
        });

        // Listen to seek events
        //const id1 = Events.on('seekFwd', updateProgress);
        //const id2 = Events.on('seekBwd', updateProgress);

        // First call to `updateProgress` which will originate a succession of updates
        updateProgress();

        const id1 = Events.on('seekBwd', updateProgress);
        const id2 = Events.on('seekFwd', updateProgress);

        return () => {
            // Clear all timeouts
            clearTimeout(timeoutId);

            // Remove all event listeners
            progressBarContainer.removeEventListener('click', setProgress);
            progressBarButton.removeEventListener('dragstart', setProgress);
            progressBarButton.removeEventListener('drag', setProgress);
            progressBarButton.removeEventListener('dragend', setProgress);

            // Remove all event listeners
            Events.remove(id1);
            Events.remove(id2);
        }
    });

    return (
        <div id='progress-bar-container'>
            <div id='progress-bar-background'>
                <div id='progress-bar-fill'>
                    <div id='progress-bar-button' draggable='true'>
                        <Circle size={16}/>
                    </div>
                </div>
            </div>
        </div>
    )
}