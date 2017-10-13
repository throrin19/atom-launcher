'use babel';

import uuidv1 from 'uuid/v1';
import Promise from 'bluebird';
import extend from 'lodash/extend';
import fs from 'fs';
import { form2js } from 'form2js';
import path from 'path';

const fsAsync = Promise.promisifyAll(fs);

export default class ModalSettingsView {
    constructor(serializedState) {
        this.element    = document.createElement('div');

        this._initModal();
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

    _initModal() {
        this.configs            = [];
        this.currentConfig      = null;
        this.hasOneNew          = false;
        this.container          = document.createElement('div');

        this.container.classList.add('settings-content');

        this._createBottomBar();
        this._createSelectList();
        this._createEmptyView();

        this.element.appendChild(this.container);
    }

    _resetContent() {
        this.bottomBar.remove();
        this.listContainer.remove();
        this.container.remove();
    }

    _createBottomBar() {
        this.bottomBar  = document.createElement('div');
        const applyBtn  = document.createElement('button');
        const okBtn     = document.createElement('button');
        const cancelBtn = document.createElement('button');

        cancelBtn.addEventListener('click', () => {
            const target = atom.views.getView(atom.workspace);
            atom.commands.dispatch(target, 'active-launcher-modal-settings:toggle');

            this._resetContent();
            this._initModal();
        });

        okBtn.addEventListener('click', () => {
            this._saveConfig()
                .then(() => {
                    const target = atom.views.getView(atom.workspace);
                    atom.commands.dispatch(target, 'active-launcher-modal-settings:toggle');
                });
        });

        applyBtn.addEventListener('click', () => {
            this._saveConfig();
        });

        applyBtn.classList.add('btn');
        okBtn.classList.add('btn');
        cancelBtn.classList.add('btn');

        applyBtn.textContent    = 'Apply';
        okBtn.textContent       = 'Ok';
        cancelBtn.textContent   = 'Cancel';

        this.bottomBar.classList.add('modal-bottom');
        this.bottomBar.appendChild(okBtn);
        this.bottomBar.appendChild(cancelBtn);
        this.bottomBar.appendChild(applyBtn);

        this.element.appendChild(this.bottomBar);
    }

    _createSelectList() {
        this.listContainer  = document.createElement('div');
        const list          = document.createElement('ol');

        this.listContainer.classList.add('select-list');
        list.classList.add('list-group');

        this._createNewEntryBtn(list);

        this.listContainer.appendChild(list);
        this.element.appendChild(this.listContainer);
    }

    _createNewEntryBtn(list) {
        const btn       = document.createElement('li');
        const badge     = document.createElement('div');
        const content   = document.createElement('div');

        badge.classList.add('status', 'status-added', 'icon', 'icon-diff-added');
        content.classList.add('icon', 'icon-file-text');

        content.textContent = 'Add new Launcher entry';

        btn.appendChild(badge);
        btn.appendChild(content);
        list.appendChild(btn);

        btn.addEventListener('click', () => {
            // limite creation of one element at the same time
            if (this.hasOneNew) {
                return;
            }

            this.hasOneNew = true;

            this._createEntryBtn(list, {
                id    : uuidv1(),
                isNew : true,
                name  : 'unnamed',
            });
        });
    }

    _createEntryBtn(list, config) {
        const btn       = document.createElement('li');
        const content   = document.createElement('div');

        content.textContent = config.name || 'unnamed';
        btn.dataset.id      = config.id;

        btn.addEventListener('click', () => {
            this._showForm({ btn, config, list });
        });

        if (config.isNew) {
            content.textContent += '*';
            btn.click();
        }

        btn.appendChild(content);
        list.appendChild(btn);
    }

    _createEmptyView() {
        const empty = document.createElement('ul');
        const message = document.createElement('li');

        message.textContent = 'Select or create launcher configuration';

        empty.classList.add('background-message', 'centered', 'empty');
        empty.appendChild(message);

        this.container.innerHTML = '';
        this.container.appendChild(empty);
    }

    _showForm({ btn, config, list }) {
        this.config = config;

        const empty         = this.container.querySelector('.empty');
        const oldForm       = this.container.querySelector('.settings-form');
        const form          = document.createElement('form');
        const envLine       = document.createElement('div');
        const envLabelCol   = document.createElement('div');
        const envButtonCol  = document.createElement('div');
        const envLabel      = document.createElement('label');
        const envAddBtn     = document.createElement('button');
        const formLines     = [
            { id : 'name', name : 'Name' },
            { id : 'binary', name : 'Binary Path' },
            { id : 'execFile', name : 'File to Execute' },
            { id : 'appParams', name : 'Application Params' },
        ];
        let indexEnvs = 0;

        list.childNodes.forEach((item) => {
            item.classList.remove('selected');
        });

        btn.classList.add('selected');

        if (empty) {
            empty.remove();
        }

        if (oldForm) {
            oldForm.remove();
        }

        form.classList.add('settings-form');

        formLines.forEach((field) => {
            const line      = document.createElement('div');
            const labelCol  = document.createElement('div');
            const inputCol  = document.createElement('div');
            const label     = document.createElement('label');
            const input     = document.createElement('input');

            line.classList.add('row');
            labelCol.classList.add('col-label');
            inputCol.classList.add('col-input');
            input.classList.add('input-text');

            label.textContent = field.name;
            label.htmlFor     = field.id;
            input.placeholder = field.name;
            input.id          = field.id;
            input.name        = field.id;

            if (config[field.id]) {
                input.value       = config[field.id];
            }

            inputCol.appendChild(input);
            labelCol.appendChild(label);
            line.appendChild(labelCol);
            line.appendChild(inputCol);
            form.appendChild(line);
        });

        envLabel.textContent    = 'Environment Variables';
        envAddBtn.textContent   = 'Add ENV';
        envAddBtn.classList.add('btn', 'inline-block');
        envLabelCol.classList.add('col-label');
        envButtonCol.classList.add('col-input');
        envLine.classList.add('row');
        envLabelCol.appendChild(envLabel);
        envButtonCol.appendChild(envAddBtn);
        envLine.appendChild(envLabelCol);
        envLine.appendChild(envButtonCol);
        form.appendChild(envLine);

        envAddBtn.addEventListener('click', () => {
            this._createEnvLine({ indexEnvs, form });

            ++indexEnvs;
        });

        this.container.appendChild(form);
    }

    _createEnvLine({ indexEnvs, form, data }) {
        const envLine       = document.createElement('div');
        const envNameCol    = document.createElement('div');
        const envValueCol   = document.createElement('div');
        const envDelCol     = document.createElement('div');
        const inputVal      = document.createElement('input');
        const inputName     = document.createElement('input');
        const btnDel        = document.createElement('button');

        btnDel.addEventListener('click', () => {
            envLine.remove();
        });

        envLine.classList.add('row');
        envNameCol.classList.add('col-env-name');
        envValueCol.classList.add('col-env-value');
        envDelCol.classList.add('col-env-delete');
        inputVal.classList.add('input-text');
        inputName.classList.add('input-text');
        btnDel.classList.add('btn' , 'btn-sm', 'icon', 'icon-trashcan');

        inputName.name          = `envs[${indexEnvs}][key]`;
        inputName.placeholder   = 'Key';
        inputVal.name           = `envs[${indexEnvs}][value]`;
        inputVal.placeholder    = 'Value';

        envDelCol.appendChild(btnDel);
        envValueCol.appendChild(inputVal);
        envNameCol.appendChild(inputName);
        envLine.appendChild(envNameCol);
        envLine.appendChild(envValueCol);
        envLine.appendChild(envDelCol);
        form.appendChild(envLine);
    }

    _saveConfig() {
        const form = this.container.querySelector('.settings-form');

        if (!form) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const data      = form2js(form);
            const oldConfig = this.configs.find(config => config.id === this.config.id);

            this.config = extend(this.config, data);

            delete this.config.isNew;

            if (oldConfig) {
                this.configs = this.configs.map((config) => {
                    if (config.id === this.config.id) {
                        config = this.config;
                    }
                    return config;
                });
            } else {
                this.configs.push(this.config);
            }

            console.log(this.config, this.configs);
            return resolve();
        }).then(() => this._saveConfigFile());
    }

    _saveConfigFile() {
        const jsonString = JSON.stringify(this.configs, null, 2);

        return fs.mkdirAsync(path.join(atom.project.getPaths()[0], '.atom'))
            .catch(() => {})
            .finally(() => fs.writeFileAsync(path.join(atom.project.getPaths()[0], '.atom', 'atom-launcher.json'), jsonString));
    }
};
