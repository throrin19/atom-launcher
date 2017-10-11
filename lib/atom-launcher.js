'use babel';

import StatusBarLauncherView from './status-bar-launcher-view';
import { CompositeDisposable } from 'atom';

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
        this.subscriptions = new CompositeDisposable();
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
};
