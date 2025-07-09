import { Channel, HomeFeed, Search, VideoInfo } from '../../parser/ytkids/index.js';
import type { Session, ApiResponse } from '../index.js';
export default class Kids {
    #private;
    constructor(session: Session);
    search(query: string): Promise<Search>;
    getInfo(video_id: string): Promise<VideoInfo>;
    getChannel(channel_id: string): Promise<Channel>;
    getHomeFeed(): Promise<HomeFeed>;
    /**
     * Retrieves the list of supervised accounts that the signed-in user has
     * access to, and blocks the given channel for each of them.
     * @param channel_id - The channel id to block.
     * @returns A list of API responses.
     */
    blockChannel(channel_id: string): Promise<ApiResponse[]>;
}
