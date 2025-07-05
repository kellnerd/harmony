import type { Actions, ApiResponse } from '../index.js';
export default class InteractionManager {
    #private;
    constructor(actions: Actions);
    /**
     * Likes a given video.
     * @param video_id - The video ID
     */
    like(video_id: string): Promise<ApiResponse>;
    /**
     * Dislikes a given video.
     * @param video_id - The video ID
     */
    dislike(video_id: string): Promise<ApiResponse>;
    /**
     * Removes a like/dislike.
     * @param video_id - The video ID
     */
    removeRating(video_id: string): Promise<ApiResponse>;
    /**
     * Subscribes to the given channel.
     * @param channel_id - The channel ID
     */
    subscribe(channel_id: string): Promise<ApiResponse>;
    /**
     * Unsubscribes from the given channel.
     * @param channel_id - The channel ID
     */
    unsubscribe(channel_id: string): Promise<ApiResponse>;
    /**
     * Posts a comment on a given video.
     * @param video_id - The video ID
     * @param text - The comment text
     */
    comment(video_id: string, text: string): Promise<ApiResponse>;
    /**
     * Translates a given text using YouTube's comment translation feature.
     * @param text - The text to translate
     * @param target_language - an ISO language code
     * @param args - optional arguments
     */
    translate(text: string, target_language: string, args?: {
        video_id?: string;
        comment_id?: string;
    }): Promise<{
        success: boolean;
        status_code: number;
        translated_content: any;
        data: import("../../parser/index.js").IRawResponse;
    }>;
    /**
     * Changes notification preferences for a given channel.
     * Only works with channels you are subscribed to.
     * @param channel_id - The channel ID.
     * @param type - The notification type.
     */
    setNotificationPreferences(channel_id: string, type: 'PERSONALIZED' | 'ALL' | 'NONE'): Promise<ApiResponse>;
}
