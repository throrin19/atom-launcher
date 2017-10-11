'use babel';

export default class StatusBarLauncherView {
    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('atom-launcher-status');
        this.element.classList.add('inline-block');

        const icon  = document.createElement('span');
        const title = document.createElement('span')

        icon.classList.add('inline-block');
        icon.classList.add('status-ignored');
        icon.classList.add('icon');
        icon.classList.add('status-ignored');
        icon.classList.add('icon-playback-play');
        icon.textContent = 'Run';

        // title.classList.add('inline-block');
        // title.classList.add('status-ignored');
        // title.textContent = 'Run';

        this.element.appendChild(icon);
        // this.element.appendChild(title);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }
};
