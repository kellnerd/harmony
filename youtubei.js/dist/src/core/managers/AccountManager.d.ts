import type { Actions } from '../index.js';
import AccountInfo from '../../parser/youtube/AccountInfo.js';
import Settings from '../../parser/youtube/Settings.js';
import { AccountItem } from '../../parser/nodes.js';
export default class AccountManager {
    #private;
    constructor(actions: Actions);
    /**
     * Retrieves the list of channels belonging to the signed-in account. Only useful when signed in through cookie. If signed in through OAuth, you will get the active channel only.
     */
    getInfo(all: true): Promise<AccountItem[]>;
    /**
     * Retrieves the active channel info for the signed-in account. Throws error if `on_behalf_of_user` was used to create the Innertube instance; use `getInfo(true)` instead.
     */
    getInfo(all?: false): Promise<AccountInfo>;
    /**
     * Gets YouTube settings.
     */
    getSettings(): Promise<Settings>;
}
