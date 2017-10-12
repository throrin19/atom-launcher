'use babel';

export default class ModalSettingsView {
    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');

        this._createBottomBar();
        this._createSelectList();
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

    _createBottomBar() {
        const bottomBar = document.createElement('div');
        const applyBtn  = document.createElement('button');
        const okBtn     = document.createElement('button');
        const cancelBtn = document.createElement('button');

        cancelBtn.addEventListener('click', () => {
            const target = atom.views.getView(atom.workspace);
            atom.commands.dispatch(target, 'active-launcher-modal-settings:toggle');
        });

        applyBtn.classList.add('btn');
        okBtn.classList.add('btn');
        cancelBtn.classList.add('btn');

        applyBtn.textContent    = 'Apply';
        okBtn.textContent       = 'Ok';
        cancelBtn.textContent   = 'Cancel';

        bottomBar.classList.add('modal-bottom');
        bottomBar.appendChild(okBtn);
        bottomBar.appendChild(cancelBtn);
        bottomBar.appendChild(applyBtn);

        this.element.appendChild(bottomBar);
    }

    _createSelectList() {
        const listContainer = document.createElement('div');
        const list          = document.createElement('ol');

        listContainer.classList.add('select-list');
        list.classList.add('list-group');

        this._createNewEntryBtn(list);

        listContainer.appendChild(list);
        this.element.appendChild(listContainer);
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
    }
};
