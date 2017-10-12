'use babel';

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
            const target = atom.views.getView(atom.workspace);
            atom.commands.dispatch(target, 'active-launcher-modal-settings:toggle');
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
            this._createEntryBtn(list, {
                isNew : true,
                name  : 'unnamed',
            });
        });
    }

    _createEntryBtn(list, config) {
        const btn       = document.createElement('li');
        const content   = document.createElement('div');

        content.textContent = config.name || 'unnamed';

        if (config.isNew) {
            content.textContent += '*';
        }

        btn.appendChild(content);
        list.appendChild(btn);
    }

    _createEmptyView() {
        const empty = document.createElement('ul');
        const message = document.createElement('li');

        message.textContent = 'Select or create launcher configuration';

        empty.classList.add('background-message', 'centered');
        empty.appendChild(message);

        this.container.innerHTML = '';
        this.container.appendChild(empty);
    }
};
