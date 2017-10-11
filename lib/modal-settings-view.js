'use babel';

export default class ModalSettingsView {
    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');

        this._createBottomBar();
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
};
