import { YTNode } from '../helpers.js';
import { type IEndpoint, type RawNode } from '../index.js';
import OpenPopupAction from './actions/OpenPopupAction.js';
import CreatePlaylistDialog from './CreatePlaylistDialog.js';
import type Actions from '../../core/Actions.js';
import type ModalWithTitleAndButton from './ModalWithTitleAndButton.js';
import type { ApiResponse } from '../../core/Actions.js';
import type { IParsedResponse } from '../types/index.js';
export type Metadata = {
    url?: string;
    api_url?: string;
    page_type?: string;
    send_post?: boolean;
};
export default class NavigationEndpoint extends YTNode {
    static type: string;
    name?: string;
    payload: any;
    dialog?: CreatePlaylistDialog | YTNode | null;
    modal?: ModalWithTitleAndButton | YTNode | null;
    open_popup?: OpenPopupAction | null;
    next_endpoint?: NavigationEndpoint;
    metadata: Metadata;
    command?: YTNode | YTNode & IEndpoint;
    commands?: NavigationEndpoint[];
    constructor(data: RawNode);
    /**
     * Sometimes InnerTube does not return an API url, in that case the library should set it based on the name of the payload object.
     * @deprecated This should be removed in the future.
     */
    getPath(name: string): "/player" | "/search" | "/browse" | "/next" | "/live_chat/get_item_context_menu" | undefined;
    call<T extends IParsedResponse>(actions: Actions, args: {
        [key: string]: any;
        parse: true;
    }): Promise<T>;
    call(actions: Actions, args?: {
        [key: string]: any;
        parse?: false;
    }): Promise<ApiResponse>;
    toURL(): string | undefined;
}
