import { YTNode } from './helpers.js';
import { Thumbnail } from './misc.js';
import { NavigationEndpoint, LiveChatItemList, LiveChatHeader, LiveChatParticipantsList, Message } from './nodes.js';
import type { RawNode } from './index.js';
import type { ObservedArray } from './helpers.js';
export declare class ItemSectionContinuation extends YTNode {
    static readonly type = "itemSectionContinuation";
    contents: ObservedArray<YTNode> | null;
    continuation?: string;
    constructor(data: RawNode);
}
export declare class NavigateAction extends YTNode {
    static readonly type = "navigateAction";
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
export declare class ShowMiniplayerCommand extends YTNode {
    static readonly type = "showMiniplayerCommand";
    miniplayer_command: NavigationEndpoint;
    show_premium_branding: boolean;
    constructor(data: RawNode);
}
export { default as AppendContinuationItemsAction } from './classes/actions/AppendContinuationItemsAction.js';
export declare class ReloadContinuationItemsCommand extends YTNode {
    static readonly type = "reloadContinuationItemsCommand";
    target_id: string;
    contents: ObservedArray<YTNode> | null;
    slot?: string;
    constructor(data: RawNode);
}
export declare class SectionListContinuation extends YTNode {
    static readonly type = "sectionListContinuation";
    continuation: string;
    contents: ObservedArray<YTNode> | null;
    constructor(data: RawNode);
}
export declare class MusicPlaylistShelfContinuation extends YTNode {
    static readonly type = "musicPlaylistShelfContinuation";
    continuation: string;
    contents: ObservedArray<YTNode> | null;
    constructor(data: RawNode);
}
export declare class MusicShelfContinuation extends YTNode {
    static readonly type = "musicShelfContinuation";
    continuation: string;
    contents: ObservedArray<YTNode> | null;
    constructor(data: RawNode);
}
export declare class GridContinuation extends YTNode {
    static readonly type = "gridContinuation";
    continuation: string;
    items: ObservedArray<YTNode> | null;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode> | null;
}
export declare class PlaylistPanelContinuation extends YTNode {
    static readonly type = "playlistPanelContinuation";
    continuation: string;
    contents: ObservedArray<YTNode> | null;
    constructor(data: RawNode);
}
export declare class Continuation extends YTNode {
    static readonly type = "continuation";
    continuation_type: string;
    timeout_ms?: number;
    time_until_last_message_ms?: number;
    token: string;
    constructor(data: RawNode);
}
export declare class LiveChatContinuation extends YTNode {
    static readonly type = "liveChatContinuation";
    actions: ObservedArray<YTNode>;
    action_panel: YTNode | null;
    item_list: LiveChatItemList | null;
    header: LiveChatHeader | null;
    participants_list: LiveChatParticipantsList | null;
    popout_message: Message | null;
    emojis: {
        emoji_id: string;
        shortcuts: string[];
        search_terms: string[];
        image: Thumbnail[];
    }[];
    continuation: Continuation;
    viewer_name: string;
    constructor(data: RawNode);
}
export declare class ContinuationCommand extends YTNode {
    static readonly type = "ContinuationCommand";
    request: string;
    token: string;
    constructor(data: RawNode);
}
