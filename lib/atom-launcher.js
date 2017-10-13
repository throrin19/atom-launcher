'use babel';

import StatusBarLauncherView from './status-bar-view';
import PanelView from './panel-view';
import ModalSettingsView from './modal-settings-view';

import { CompositeDisposable, Disposable } from 'atom';

export default {
    modalSettingsView       : null,
    modalSettingsPanel      : null,
    statusBarLauncherView   : null,
    subscriptions           : null,
    statusBarTile           : null,
    config                  : {
        // les configs permettent de saisir des infos dans la partie paramètres
    },
    activate(state) {
        this.modalSettingsView     = new ModalSettingsView(state.modalSettingsViewState);
        this.statusBarLauncherView = new StatusBarLauncherView(state.statusBarLauncherViewState);

        this.modalSettingsPanel = atom.workspace.addModalPanel({
            className : 'atom-launcher-modal-settings',
            item      : this.modalSettingsView.getElement(),
            visible   : false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable(
            atom.workspace.addOpener((uri) => {
                if (uri === 'atom://atom-launcher-panel') {
                    return new PanelView();
                }
            }),
            atom.commands.add('atom-workspace', {
                'active-launcher-panel:toggle'          : () => this.togglePannel(),
                'active-launcher-modal-settings:toggle' : () => this.toggleModalSettings(),
            }),
            new Disposable(() => {
                atom.workspace.getPaneItems().forEach((item) => {
                    if (item instanceof PanelView) {
                        item.destroy();
                    }
                });
            })
        );
    },
    deactivate() {
        this.modalSettingsPanel.destroy();
        this.subscriptions.dispose();
        this.statusBarTile.destroy();
        this.statusBarTile = null;
        this.modalSettingsView.destroy();
        this.statusBarLauncherView.destroy();
    },
    serialize() {
        return {
            // atomLauncherViewState: this.atomLauncherView.serialize()
        };
    },
    consumeStatusBar(statusBar) {
        this.statusBarTile = statusBar.addLeftTile({
            item        : this.statusBarLauncherView,
            priority    : 100,
        });
    },
    togglePannel() {
        atom.workspace.toggle('atom://atom-launcher-panel');
    },
    toggleModalSettings() {
        return this.modalSettingsPanel.isVisible() ? this.modalSettingsPanel.hide() : this.modalSettingsPanel.show();
    },
    deserializePanelView(serialized) {
        return new PanelView();
    },
};
