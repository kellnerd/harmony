import Feed from '../../core/mixins/Feed.js';
import ItemSection from '../classes/ItemSection.js';
import BrowseFeedActions from '../classes/BrowseFeedActions.js';
import type { Actions, ApiResponse } from '../../core/index.js';
import type { IBrowseResponse } from '../types/index.js';
export default class History extends Feed<IBrowseResponse> {
    sections: ItemSection[];
    feed_actions: BrowseFeedActions;
    constructor(actions: Actions, data: ApiResponse | IBrowseResponse, already_parsed?: boolean);
    /**
     * Retrieves next batch of contents.
     */
    getContinuation(): Promise<History>;
    /**
     * Removes a video from watch history.
     */
    removeVideo(video_id: string): Promise<boolean>;
}
