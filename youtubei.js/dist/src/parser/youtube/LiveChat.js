// noinspection ES6MissingAwait
var _LiveChat_instances, _LiveChat_actions, _LiveChat_video_id, _LiveChat_channel_id, _LiveChat_continuation, _LiveChat_mcontinuation, _LiveChat_retry_count, _LiveChat_pollLivechat, _LiveChat_emitSmoothedActions, _LiveChat_pollMetadata, _LiveChat_wait;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { EventEmitter } from '../../utils/index.js';
import { InnertubeError, Platform, u8ToBase64 } from '../../utils/Utils.js';
import { LiveChatContinuation, Parser } from '../index.js';
import SmoothedQueue from './SmoothedQueue.js';
import RunAttestationCommand from '../classes/commands/RunAttestationCommand.js';
import AddChatItemAction from '../classes/livechat/AddChatItemAction.js';
import UpdateDateTextAction from '../classes/livechat/UpdateDateTextAction.js';
import UpdateDescriptionAction from '../classes/livechat/UpdateDescriptionAction.js';
import UpdateTitleAction from '../classes/livechat/UpdateTitleAction.js';
import UpdateToggleButtonTextAction from '../classes/livechat/UpdateToggleButtonTextAction.js';
import UpdateViewershipAction from '../classes/livechat/UpdateViewershipAction.js';
import NavigationEndpoint from '../classes/NavigationEndpoint.js';
import ItemMenu from './ItemMenu.js';
import { LiveMessageParams } from '../../../protos/generated/misc/params.js';
class LiveChat extends EventEmitter {
    constructor(video_info) {
        super();
        _LiveChat_instances.add(this);
        _LiveChat_actions.set(this, void 0);
        _LiveChat_video_id.set(this, void 0);
        _LiveChat_channel_id.set(this, void 0);
        _LiveChat_continuation.set(this, void 0);
        _LiveChat_mcontinuation.set(this, void 0);
        _LiveChat_retry_count.set(this, 0);
        this.running = false;
        this.is_replay = false;
        __classPrivateFieldSet(this, _LiveChat_video_id, video_info.basic_info.id, "f");
        __classPrivateFieldSet(this, _LiveChat_channel_id, video_info.basic_info.channel_id, "f");
        __classPrivateFieldSet(this, _LiveChat_actions, video_info.actions, "f");
        __classPrivateFieldSet(this, _LiveChat_continuation, video_info.livechat?.continuation, "f");
        this.is_replay = video_info.livechat?.is_replay || false;
        this.smoothed_queue = new SmoothedQueue();
        this.smoothed_queue.callback = async (actions) => {
            if (!actions.length) {
                // Wait 2 seconds before requesting an incremental continuation if the action group is empty.
                await __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_wait).call(this, 2000);
            }
            else if (actions.length < 10) {
                // If there are less than 10 actions, wait until all of them are emitted.
                await __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_emitSmoothedActions).call(this, actions);
            }
            else if (this.is_replay) {
                /**
                 * NOTE: Live chat replays require data from the video player for actions to be emitted timely
                 * and as we don't have that, this ends up being quite innacurate.
                 */
                __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_emitSmoothedActions).call(this, actions);
                await __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_wait).call(this, 2000);
            }
            else {
                // There are more than 10 actions, emit them asynchronously so we can request the next incremental continuation.
                __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_emitSmoothedActions).call(this, actions);
            }
            if (this.running) {
                __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_pollLivechat).call(this);
            }
        };
    }
    on(type, listener) {
        super.on(type, listener);
    }
    once(type, listener) {
        super.once(type, listener);
    }
    start() {
        if (!this.running) {
            this.running = true;
            __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_pollLivechat).call(this);
            __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_pollMetadata).call(this);
        }
    }
    stop() {
        this.smoothed_queue.clear();
        this.running = false;
    }
    /**
     * Sends a message.
     * @param text - Text to send.
     */
    async sendMessage(text) {
        const writer = LiveMessageParams.encode({
            params: {
                ids: {
                    videoId: __classPrivateFieldGet(this, _LiveChat_video_id, "f"),
                    channelId: __classPrivateFieldGet(this, _LiveChat_channel_id, "f")
                }
            },
            number0: 1,
            number1: 4
        });
        const params = btoa(encodeURIComponent(u8ToBase64(writer.finish())));
        const response = await __classPrivateFieldGet(this, _LiveChat_actions, "f").execute('/live_chat/send_message', {
            richMessage: { textSegments: [{ text }] },
            clientMessageId: Platform.shim.uuidv4(),
            client: 'WEB',
            parse: true,
            params
        });
        if (!response.actions)
            throw new InnertubeError('Unexpected response from send_message', response);
        return response.actions.array().as(AddChatItemAction, RunAttestationCommand);
    }
    /**
     * Applies given filter to the live chat.
     * @param filter - Filter to apply.
     */
    applyFilter(filter) {
        if (!this.initial_info)
            throw new InnertubeError('Cannot apply filter before initial info is retrieved.');
        const menu_items = this.initial_info?.header?.view_selector?.sub_menu_items;
        if (filter === 'TOP_CHAT') {
            if (menu_items?.at(0)?.selected)
                return;
            __classPrivateFieldSet(this, _LiveChat_continuation, menu_items?.at(0)?.continuation, "f");
        }
        else {
            if (menu_items?.at(1)?.selected)
                return;
            __classPrivateFieldSet(this, _LiveChat_continuation, menu_items?.at(1)?.continuation, "f");
        }
    }
    /**
     * Retrieves given chat item's menu.
     */
    async getItemMenu(item) {
        if (!item.hasKey('menu_endpoint') || !item.key('menu_endpoint').isInstanceof(NavigationEndpoint))
            throw new InnertubeError('This item does not have a menu.', item);
        const response = await item.key('menu_endpoint').instanceof(NavigationEndpoint).call(__classPrivateFieldGet(this, _LiveChat_actions, "f"), { parse: true });
        if (!response)
            throw new InnertubeError('Could not retrieve item menu.', item);
        return new ItemMenu(response, __classPrivateFieldGet(this, _LiveChat_actions, "f"));
    }
    /**
     * Equivalent to "clicking" a button.
     */
    async selectButton(button) {
        return await button.endpoint.call(__classPrivateFieldGet(this, _LiveChat_actions, "f"), { parse: true });
    }
}
_LiveChat_actions = new WeakMap(), _LiveChat_video_id = new WeakMap(), _LiveChat_channel_id = new WeakMap(), _LiveChat_continuation = new WeakMap(), _LiveChat_mcontinuation = new WeakMap(), _LiveChat_retry_count = new WeakMap(), _LiveChat_instances = new WeakSet(), _LiveChat_pollLivechat = function _LiveChat_pollLivechat() {
    (async () => {
        var _a, _b;
        try {
            const response = await __classPrivateFieldGet(this, _LiveChat_actions, "f").execute(this.is_replay ? 'live_chat/get_live_chat_replay' : 'live_chat/get_live_chat', { continuation: __classPrivateFieldGet(this, _LiveChat_continuation, "f"), parse: true });
            const contents = response.continuation_contents;
            if (!contents) {
                this.emit('error', new InnertubeError('Unexpected live chat incremental continuation response', response));
                this.emit('end');
                this.stop();
            }
            if (!(contents instanceof LiveChatContinuation)) {
                this.stop();
                this.emit('end');
                return;
            }
            __classPrivateFieldSet(this, _LiveChat_continuation, contents.continuation.token, "f");
            // Header only exists in the first request
            if (contents.header) {
                this.initial_info = contents;
                this.emit('start', contents);
                if (this.running)
                    __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_pollLivechat).call(this);
            }
            else {
                this.smoothed_queue.enqueueActionGroup(contents.actions);
            }
            __classPrivateFieldSet(this, _LiveChat_retry_count, 0, "f");
        }
        catch (err) {
            this.emit('error', err);
            if ((__classPrivateFieldSet(this, _LiveChat_retry_count, (_b = __classPrivateFieldGet(this, _LiveChat_retry_count, "f"), _a = _b++, _b), "f"), _a) < 10) {
                await __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_wait).call(this, 2000);
                __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_pollLivechat).call(this);
            }
            else {
                this.emit('error', new InnertubeError('Reached retry limit for incremental continuation requests', err));
                this.emit('end');
                this.stop();
            }
        }
    })();
}, _LiveChat_emitSmoothedActions = 
/**
 * Ensures actions are emitted at the right speed.
 * This and {@link SmoothedQueue} were based off of YouTube's own implementation.
 */
async function _LiveChat_emitSmoothedActions(action_queue) {
    const base = 1E4;
    let delay = action_queue.length < base / 80 ? 1 : Math.ceil(action_queue.length / (base / 80));
    const emit_delay_ms = delay == 1 ? (delay = base / action_queue.length,
        delay *= Math.random() + 0.5,
        delay = Math.min(1E3, delay),
        delay = Math.max(80, delay)) : delay = 80;
    for (const action of action_queue) {
        await __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_wait).call(this, emit_delay_ms);
        this.emit('chat-update', action);
    }
}, _LiveChat_pollMetadata = function _LiveChat_pollMetadata() {
    (async () => {
        try {
            const payload = { videoId: __classPrivateFieldGet(this, _LiveChat_video_id, "f") };
            if (__classPrivateFieldGet(this, _LiveChat_mcontinuation, "f")) {
                payload.continuation = __classPrivateFieldGet(this, _LiveChat_mcontinuation, "f");
            }
            const response = await __classPrivateFieldGet(this, _LiveChat_actions, "f").execute('/updated_metadata', payload);
            const data = Parser.parseResponse(response.data);
            __classPrivateFieldSet(this, _LiveChat_mcontinuation, data.continuation?.token, "f");
            this.metadata = {
                title: data.actions?.array().firstOfType(UpdateTitleAction) || this.metadata?.title,
                description: data.actions?.array().firstOfType(UpdateDescriptionAction) || this.metadata?.description,
                views: data.actions?.array().firstOfType(UpdateViewershipAction) || this.metadata?.views,
                likes: data.actions?.array().firstOfType(UpdateToggleButtonTextAction) || this.metadata?.likes,
                date: data.actions?.array().firstOfType(UpdateDateTextAction) || this.metadata?.date
            };
            this.emit('metadata-update', this.metadata);
            await __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_wait).call(this, 5000);
            if (this.running)
                __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_pollMetadata).call(this);
        }
        catch {
            await __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_wait).call(this, 2000);
            if (this.running)
                __classPrivateFieldGet(this, _LiveChat_instances, "m", _LiveChat_pollMetadata).call(this);
        }
    })();
}, _LiveChat_wait = async function _LiveChat_wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
};
export default LiveChat;
//# sourceMappingURL=LiveChat.js.map