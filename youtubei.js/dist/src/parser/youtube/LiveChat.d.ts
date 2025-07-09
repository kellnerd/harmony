import { EventEmitter } from '../../utils/index.js';
import { LiveChatContinuation } from '../index.js';
import SmoothedQueue from './SmoothedQueue.js';
import RunAttestationCommand from '../classes/commands/RunAttestationCommand.js';
import AddChatItemAction from '../classes/livechat/AddChatItemAction.js';
import UpdateDateTextAction from '../classes/livechat/UpdateDateTextAction.js';
import UpdateDescriptionAction from '../classes/livechat/UpdateDescriptionAction.js';
import UpdateTitleAction from '../classes/livechat/UpdateTitleAction.js';
import UpdateToggleButtonTextAction from '../classes/livechat/UpdateToggleButtonTextAction.js';
import UpdateViewershipAction from '../classes/livechat/UpdateViewershipAction.js';
import ItemMenu from './ItemMenu.js';
import type { ObservedArray } from '../helpers.js';
import type VideoInfo from './VideoInfo.js';
import type AddBannerToLiveChatCommand from '../classes/livechat/AddBannerToLiveChatCommand.js';
import type RemoveBannerForLiveChatCommand from '../classes/livechat/RemoveBannerForLiveChatCommand.js';
import type ShowLiveChatTooltipCommand from '../classes/livechat/ShowLiveChatTooltipCommand.js';
import type LiveChatAutoModMessage from '../classes/livechat/items/LiveChatAutoModMessage.js';
import type LiveChatMembershipItem from '../classes/livechat/items/LiveChatMembershipItem.js';
import type LiveChatPaidMessage from '../classes/livechat/items/LiveChatPaidMessage.js';
import type LiveChatPaidSticker from '../classes/livechat/items/LiveChatPaidSticker.js';
import type LiveChatTextMessage from '../classes/livechat/items/LiveChatTextMessage.js';
import type LiveChatViewerEngagementMessage from '../classes/livechat/items/LiveChatViewerEngagementMessage.js';
import type AddLiveChatTickerItemAction from '../classes/livechat/AddLiveChatTickerItemAction.js';
import type MarkChatItemAsDeletedAction from '../classes/livechat/MarkChatItemAsDeletedAction.js';
import type MarkChatItemsByAuthorAsDeletedAction from '../classes/livechat/MarkChatItemsByAuthorAsDeletedAction.js';
import type ReplaceChatItemAction from '../classes/livechat/ReplaceChatItemAction.js';
import type ReplayChatItemAction from '../classes/livechat/ReplayChatItemAction.js';
import type ShowLiveChatActionPanelAction from '../classes/livechat/ShowLiveChatActionPanelAction.js';
import type Button from '../classes/Button.js';
import type { IParsedResponse } from '../types/index.js';
export type ChatAction = AddChatItemAction | AddBannerToLiveChatCommand | AddLiveChatTickerItemAction | MarkChatItemAsDeletedAction | MarkChatItemsByAuthorAsDeletedAction | RemoveBannerForLiveChatCommand | ReplaceChatItemAction | ReplayChatItemAction | ShowLiveChatActionPanelAction | ShowLiveChatTooltipCommand;
export type ChatItemWithMenu = LiveChatAutoModMessage | LiveChatMembershipItem | LiveChatPaidMessage | LiveChatPaidSticker | LiveChatTextMessage | LiveChatViewerEngagementMessage;
export type LiveMetadata = {
    title?: UpdateTitleAction;
    description?: UpdateDescriptionAction;
    views?: UpdateViewershipAction;
    likes?: UpdateToggleButtonTextAction;
    date?: UpdateDateTextAction;
};
export default class LiveChat extends EventEmitter {
    #private;
    smoothed_queue: SmoothedQueue;
    initial_info?: LiveChatContinuation;
    metadata?: LiveMetadata;
    running: boolean;
    is_replay: boolean;
    constructor(video_info: VideoInfo);
    on(type: 'start', listener: (initial_data: LiveChatContinuation) => void): void;
    on(type: 'chat-update', listener: (action: ChatAction) => void): void;
    on(type: 'metadata-update', listener: (metadata: LiveMetadata) => void): void;
    on(type: 'error', listener: (err: Error) => void): void;
    on(type: 'end', listener: () => void): void;
    once(type: 'start', listener: (initial_data: LiveChatContinuation) => void): void;
    once(type: 'chat-update', listener: (action: ChatAction) => void): void;
    once(type: 'metadata-update', listener: (metadata: LiveMetadata) => void): void;
    once(type: 'error', listener: (err: Error) => void): void;
    once(type: 'end', listener: () => void): void;
    start(): void;
    stop(): void;
    /**
     * Sends a message.
     * @param text - Text to send.
     */
    sendMessage(text: string): Promise<ObservedArray<AddChatItemAction | RunAttestationCommand>>;
    /**
     * Applies given filter to the live chat.
     * @param filter - Filter to apply.
     */
    applyFilter(filter: 'TOP_CHAT' | 'LIVE_CHAT'): void;
    /**
     * Retrieves given chat item's menu.
     */
    getItemMenu(item: ChatItemWithMenu): Promise<ItemMenu>;
    /**
     * Equivalent to "clicking" a button.
     */
    selectButton(button: Button): Promise<IParsedResponse>;
}
