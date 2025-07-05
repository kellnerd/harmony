import { YTNode, observe } from './helpers.js';
import { Thumbnail } from './misc.js';
import { NavigationEndpoint, LiveChatItemList, LiveChatHeader, LiveChatParticipantsList, Message } from './nodes.js';
import * as Parser from './parser.js';
export class ItemSectionContinuation extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents);
        if (Array.isArray(data.continuations)) {
            this.continuation = data.continuations?.at(0)?.nextContinuationData?.continuation;
        }
    }
}
ItemSectionContinuation.type = 'itemSectionContinuation';
export class NavigateAction extends YTNode {
    constructor(data) {
        super();
        this.endpoint = new NavigationEndpoint(data.endpoint);
    }
}
NavigateAction.type = 'navigateAction';
export class ShowMiniplayerCommand extends YTNode {
    constructor(data) {
        super();
        this.miniplayer_command = new NavigationEndpoint(data.miniplayerCommand);
        this.show_premium_branding = data.showPremiumBranding;
    }
}
ShowMiniplayerCommand.type = 'showMiniplayerCommand';
export { default as AppendContinuationItemsAction } from './classes/actions/AppendContinuationItemsAction.js';
export class ReloadContinuationItemsCommand extends YTNode {
    constructor(data) {
        super();
        this.target_id = data.targetId;
        this.contents = Parser.parse(data.continuationItems, true);
        this.slot = data?.slot;
    }
}
ReloadContinuationItemsCommand.type = 'reloadContinuationItemsCommand';
export class SectionListContinuation extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parse(data.contents, true);
        this.continuation =
            data.continuations?.[0]?.nextContinuationData?.continuation ||
                data.continuations?.[0]?.reloadContinuationData?.continuation || null;
    }
}
SectionListContinuation.type = 'sectionListContinuation';
export class MusicPlaylistShelfContinuation extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parse(data.contents, true);
        this.continuation = data.continuations?.[0].nextContinuationData.continuation || null;
    }
}
MusicPlaylistShelfContinuation.type = 'musicPlaylistShelfContinuation';
export class MusicShelfContinuation extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents);
        this.continuation =
            data.continuations?.[0].nextContinuationData?.continuation ||
                data.continuations?.[0].reloadContinuationData?.continuation || null;
    }
}
MusicShelfContinuation.type = 'musicShelfContinuation';
export class GridContinuation extends YTNode {
    constructor(data) {
        super();
        this.items = Parser.parse(data.items, true);
        this.continuation = data.continuations?.[0].nextContinuationData.continuation || null;
    }
    get contents() {
        return this.items;
    }
}
GridContinuation.type = 'gridContinuation';
export class PlaylistPanelContinuation extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents);
        this.continuation = data.continuations?.[0]?.nextContinuationData?.continuation ||
            data.continuations?.[0]?.nextRadioContinuationData?.continuation || null;
    }
}
PlaylistPanelContinuation.type = 'playlistPanelContinuation';
export class Continuation extends YTNode {
    constructor(data) {
        super();
        this.continuation_type = data.type;
        this.timeout_ms = data.continuation?.timeoutMs;
        this.time_until_last_message_ms = data.continuation?.timeUntilLastMessageMsec;
        this.token = data.continuation?.continuation;
    }
}
Continuation.type = 'continuation';
export class LiveChatContinuation extends YTNode {
    constructor(data) {
        super();
        this.actions = Parser.parse(data.actions?.map((action) => {
            delete action.clickTrackingParams;
            return action;
        }), true) || observe([]);
        this.action_panel = Parser.parseItem(data.actionPanel);
        this.item_list = Parser.parseItem(data.itemList, LiveChatItemList);
        this.header = Parser.parseItem(data.header, LiveChatHeader);
        this.participants_list = Parser.parseItem(data.participantsList, LiveChatParticipantsList);
        this.popout_message = Parser.parseItem(data.popoutMessage, Message);
        this.emojis = data.emojis?.map((emoji) => ({
            emoji_id: emoji.emojiId,
            shortcuts: emoji.shortcuts,
            search_terms: emoji.searchTerms,
            image: Thumbnail.fromResponse(emoji.image),
            is_custom_emoji: emoji.isCustomEmoji
        })) || [];
        let continuation, type;
        if (data.continuations?.[0].timedContinuationData) {
            type = 'timed';
            continuation = data.continuations?.[0].timedContinuationData;
        }
        else if (data.continuations?.[0].invalidationContinuationData) {
            type = 'invalidation';
            continuation = data.continuations?.[0].invalidationContinuationData;
        }
        else if (data.continuations?.[0].liveChatReplayContinuationData) {
            type = 'replay';
            continuation = data.continuations?.[0].liveChatReplayContinuationData;
        }
        this.continuation = new Continuation({ continuation, type });
        this.viewer_name = data.viewerName;
    }
}
LiveChatContinuation.type = 'liveChatContinuation';
export class ContinuationCommand extends YTNode {
    constructor(data) {
        super();
        this.request = data.request;
        this.token = data.token;
    }
}
ContinuationCommand.type = 'ContinuationCommand';
//# sourceMappingURL=continuations.js.map