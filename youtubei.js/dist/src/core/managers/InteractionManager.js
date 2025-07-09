var _InteractionManager_actions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import * as ProtoUtils from '../../utils/ProtoUtils.js';
import { throwIfMissing, u8ToBase64 } from '../../utils/Utils.js';
import { CreateCommentParams, NotificationPreferences } from '../../../protos/generated/misc/params.js';
import NavigationEndpoint from '../../parser/classes/NavigationEndpoint.js';
class InteractionManager {
    constructor(actions) {
        _InteractionManager_actions.set(this, void 0);
        __classPrivateFieldSet(this, _InteractionManager_actions, actions, "f");
    }
    /**
     * Likes a given video.
     * @param video_id - The video ID
     */
    async like(video_id) {
        throwIfMissing({ video_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const like_endpoint = new NavigationEndpoint({
            likeEndpoint: {
                status: 'LIKE',
                target: video_id
            }
        });
        return like_endpoint.call(__classPrivateFieldGet(this, _InteractionManager_actions, "f"), { client: 'TV' });
    }
    /**
     * Dislikes a given video.
     * @param video_id - The video ID
     */
    async dislike(video_id) {
        throwIfMissing({ video_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const dislike_endpoint = new NavigationEndpoint({
            likeEndpoint: {
                status: 'DISLIKE',
                target: video_id
            }
        });
        return dislike_endpoint.call(__classPrivateFieldGet(this, _InteractionManager_actions, "f"), { client: 'TV' });
    }
    /**
     * Removes a like/dislike.
     * @param video_id - The video ID
     */
    async removeRating(video_id) {
        throwIfMissing({ video_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const remove_like_endpoint = new NavigationEndpoint({
            likeEndpoint: {
                status: 'INDIFFERENT',
                target: video_id
            }
        });
        return remove_like_endpoint.call(__classPrivateFieldGet(this, _InteractionManager_actions, "f"), { client: 'TV' });
    }
    /**
     * Subscribes to the given channel.
     * @param channel_id - The channel ID
     */
    async subscribe(channel_id) {
        throwIfMissing({ channel_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const subscribe_endpoint = new NavigationEndpoint({
            subscribeEndpoint: {
                channelIds: [channel_id],
                params: 'EgIIAhgA'
            }
        });
        return subscribe_endpoint.call(__classPrivateFieldGet(this, _InteractionManager_actions, "f"));
    }
    /**
     * Unsubscribes from the given channel.
     * @param channel_id - The channel ID
     */
    async unsubscribe(channel_id) {
        throwIfMissing({ channel_id });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const unsubscribe_endpoint = new NavigationEndpoint({
            unsubscribeEndpoint: {
                channelIds: [channel_id],
                params: 'CgIIAhgA'
            }
        });
        return unsubscribe_endpoint.call(__classPrivateFieldGet(this, _InteractionManager_actions, "f"));
    }
    /**
     * Posts a comment on a given video.
     * @param video_id - The video ID
     * @param text - The comment text
     */
    async comment(video_id, text) {
        throwIfMissing({ video_id, text });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const writer = CreateCommentParams.encode({
            videoId: video_id,
            params: {
                index: 0
            },
            number: 7
        });
        const params = encodeURIComponent(u8ToBase64(writer.finish()));
        const create_comment_endpoint = new NavigationEndpoint({
            createCommentEndpoint: {
                commentText: text,
                createCommentParams: params
            }
        });
        return create_comment_endpoint.call(__classPrivateFieldGet(this, _InteractionManager_actions, "f"));
    }
    /**
     * Translates a given text using YouTube's comment translation feature.
     * @param text - The text to translate
     * @param target_language - an ISO language code
     * @param args - optional arguments
     */
    async translate(text, target_language, args = {}) {
        throwIfMissing({ text, target_language });
        const action = ProtoUtils.encodeCommentActionParams(22, { text, target_language, ...args });
        const perform_comment_action_endpoint = new NavigationEndpoint({ performCommentActionEndpoint: { action } });
        const response = await perform_comment_action_endpoint.call(__classPrivateFieldGet(this, _InteractionManager_actions, "f"));
        const mutation = response.data.frameworkUpdates.entityBatchUpdate.mutations[0].payload.commentEntityPayload;
        return {
            success: response.success,
            status_code: response.status_code,
            translated_content: mutation.translatedContent.content,
            data: response.data
        };
    }
    /**
     * Changes notification preferences for a given channel.
     * Only works with channels you are subscribed to.
     * @param channel_id - The channel ID.
     * @param type - The notification type.
     */
    async setNotificationPreferences(channel_id, type) {
        throwIfMissing({ channel_id, type });
        if (!__classPrivateFieldGet(this, _InteractionManager_actions, "f").session.logged_in)
            throw new Error('You must be signed in to perform this operation.');
        const pref_types = {
            PERSONALIZED: 1,
            ALL: 2,
            NONE: 3
        };
        if (!Object.keys(pref_types).includes(type.toUpperCase()))
            throw new Error(`Invalid notification preference type: ${type}`);
        const writer = NotificationPreferences.encode({
            channelId: channel_id,
            prefId: {
                index: pref_types[type.toUpperCase()]
            },
            number0: 0, number1: 4
        });
        const params = encodeURIComponent(u8ToBase64(writer.finish()));
        const modify_channel_notification_preference_endpoint = new NavigationEndpoint({ modifyChannelNotificationPreferenceEndpoint: { params } });
        return modify_channel_notification_preference_endpoint.call(__classPrivateFieldGet(this, _InteractionManager_actions, "f"));
    }
}
_InteractionManager_actions = new WeakMap();
export default InteractionManager;
//# sourceMappingURL=InteractionManager.js.map