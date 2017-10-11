'use babel';

import AtomLauncherView from './atom-launcher-view';
import { CompositeDisposable } from 'atom';

export default {
    atomLauncherView  : null,
    modalPanel        : null,
    subscriptions     : null,
    activate(state) {
        this.atomLauncherView   = new AtomLauncherView(state.atomLauncherViewState);
        this.modalPanel         = atom.workspace.addModalPanel({
            item    : this.atomLauncherView.getElement(),
            visible : false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-launcher:toggle': () => this.toggle()
        }));
    },
    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.atomLauncherView.destroy();
    },
    serialize() {
        return {
            atomLauncherViewState: this.atomLauncherView.serialize()
        };
    },
    toggle() {
        console.log('AtomLauncher was toggled!');
        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );
    },
};
