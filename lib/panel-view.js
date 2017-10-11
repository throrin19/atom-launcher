'use babel';

export default class PanelView {
    constructor(serializedState) {
        this.element = document.createElement('div');
        this.element.classList.add('atom-launcher-panel');

        this._createActionBar();
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

    _createActionBar() {
        const actionBar     = document.createElement('div');
        const ctrlBtns      = document.createElement('div');
        const launchBtns    = document.createElement('div');
        const selectRun     = document.createElement('select');
        const btnRuns       = document.createElement('button');
        const btnStart      = document.createElement('button');
        const btnStop       = document.createElement('button');

        ctrlBtns.classList.add('btn-group');
        btnRuns.classList.add('btn');
        btnRuns.classList.add('btn-sm');
        btnRuns.classList.add('icon');
        btnRuns.classList.add('icon-list-unordered');
        ctrlBtns.appendChild(btnRuns);

        selectRun.classList.add('select-runable');

        launchBtns.classList.add('btn-group');
        btnStart.classList.add('btn');
        btnStart.classList.add('btn-sm');
        btnStart.classList.add('icon');
        btnStart.classList.add('icon-playback-play');
        btnStop.classList.add('btn');
        btnStop.classList.add('btn-sm');
        btnStop.classList.add('icon');
        btnStop.classList.add('icon-primitive-square');
        launchBtns.appendChild(btnStart);
        launchBtns.appendChild(btnStop);
        btnStart.addEventListener('click', () => {
            btnStart.classList.add('btn-success');
            btnStart.classList.add('selected');
        });
        btnStop.addEventListener('click', () => {
            btnStart.classList.remove('btn-success');
            btnStart.classList.remove('selected');
        });

        actionBar.classList.add('panel-action-bar');

        actionBar.appendChild(ctrlBtns);
        actionBar.appendChild(selectRun);
        actionBar.appendChild(launchBtns);

        this.element.appendChild(actionBar);
    }
};
