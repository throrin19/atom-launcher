'use babel';

import fs from 'fs';
import path from 'path';

export default class PanelView {
    constructor(serializedState) {
        this.element    = document.createElement('div');
        this.actionBar  = document.createElement('div');
        this.config     = null;

        this.element.classList.add('atom-launcher-panel');

        this._createActionBar();

        this.element.appendChild(this.actionBar);
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
    }

    getElement() {
        return this.element;
    }

    _createActionBar() {
        const ctrlBtns      = document.createElement('div');
        const launchBtns    = document.createElement('div');
        const btnRuns       = document.createElement('button');
        const btnStart      = document.createElement('button');
        const btnStop       = document.createElement('button');

        ctrlBtns.classList.add('btn-group');
        btnRuns.classList.add('btn');
        btnRuns.classList.add('btn-sm');
        btnRuns.classList.add('icon');
        btnRuns.classList.add('icon-list-unordered');
        ctrlBtns.appendChild(btnRuns);
        btnRuns.addEventListener('click', () => {
            const target = atom.views.getView(atom.workspace);
            atom.commands.dispatch(target, 'active-launcher-modal-settings:toggle');
        });

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

        this.actionBar.classList.add('panel-action-bar');

        this.actionBar.appendChild(ctrlBtns);
        this.actionBar.appendChild(this._initSelect());
        this.actionBar.appendChild(launchBtns);
    }

    _initSelect() {
        const selectRun     = document.createElement('select');
        let configs;

        try {
            configs = JSON.parse(fs.readFileSync(path.join(atom.project.getPaths()[0], '.atom', 'atom-launcher.json')));
        } catch (e) {
            configs = [];
        }

        while (selectRun.hasChildNodes()) {
            selectRun.removeChild(this.selectRun.lastChild);
        }

        configs.forEach((config) => {
            const option        = document.createElement('option');
            option.value        = config.id;
            option.textContent  = config.name;

            selectRun.appendChild(option);
        });

        selectRun.classList.add('select-runable');

        return selectRun;
    }

    refreshView() {
        const previousSelect = this.actionBar.querySelector('.select-runable');
        const newSelect      = this._initSelect();

        this.actionBar.replaceChild(newSelect, previousSelect);
    }
};
