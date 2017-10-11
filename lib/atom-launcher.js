'use babel';

import StatusBarLauncherView from './status-bar-view';
import PanelView from './panel-view';
import { CompositeDisposable, Disposable } from 'atom';

export default {
    atomLauncherView        : null,
    statusBarLauncherView   : null,
    modalPanel              : null,
    subscriptions           : null,
    statusBarTile           : null,
    config                  : {
        // les configs permettent de saisir des infos dans la partie paramètres
    },
    activate(state) {
        this.statusBarLauncherView = new StatusBarLauncherView(state.statusBarLauncherViewState);

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable(
            atom.workspace.addOpener((uri) => {
                if (uri === 'atom://atom-launcher-panel') {
                    return new PanelView();
                }
            }),
            atom.commands.add('atom-workspace', {
                'active-launcher-panel:toggle' : () => this.toggle()
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
        this.subscriptions.dispose();
        this.statusBarTile.destroy();
        this.statusBarTile = null;
    },
    serialize() {
        return {
            // atomLauncherViewState: this.atomLauncherView.serialize()
        };
    },
    consumeStatusBar(statusBar) {
        console.log('consumeStatusBar');
        this.statusBarTile = statusBar.addLeftTile({
            item        : this.statusBarLauncherView,
            priority    : 100,
        });
    },
    toggle() {
        atom.workspace.toggle('atom://atom-launcher-panel');
    },
    deserializePanelView(serialized) {
        return new PanelView();
    },
};
