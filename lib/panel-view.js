'use babel';

export default class PanelView {
    constructor(serializedState) {
        this.element = document.createElement('div');
        this.element.classList.add('atom-launcher-panel');

        const message = document.createElement('div');
        message.textContent = 'The PanelView is Alive! It\'s ALIVE!';
        message.classList.add('message');
        this.element.appendChild(message);
    }

    getTitle() {
        return 'Project Launcher';
    }

    getDefaultLocation() {
        return 'bottom';
    }

    getURI() {
        return 'atom://atom-launcher-panel';
    }

    serialize() {
        return {
            deserializer : 'atom-launcher/PanelView',
        };
    }

    destroy() {
        this.element.remove();
        this.subscriptions.dispose();
    }

    getElement() {
        return this.element;
    }
};
