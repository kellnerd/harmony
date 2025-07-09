import Feed from '../../core/mixins/Feed.js';
import ItemSection from '../classes/ItemSection.js';
import BrowseFeedActions from '../classes/BrowseFeedActions.js';
import Button from '../classes/Button.js';
// TODO: make feed actions usable
export default class History extends Feed {
    constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
        this.sections = this.memo.getType(ItemSection);
        this.feed_actions = this.memo.getType(BrowseFeedActions)[0];
    }
    /**
     * Retrieves next batch of contents.
     */
    async getContinuation() {
        const response = await this.getContinuationData();
        if (!response)
            throw new Error('No continuation data found');
        return new History(this.actions, response, true);
    }
    /**
     * Removes a video from watch history.
     */
    async removeVideo(video_id) {
        let feedbackToken;
        for (const section of this.sections) {
            for (const content of section.contents) {
                const video = content;
                if (video.video_id === video_id && video.menu) {
                    feedbackToken = video.menu.top_level_buttons[0].as(Button).endpoint.payload.feedbackToken;
                    break;
                }
            }
        }
        if (!feedbackToken) {
            throw new Error('Failed to get feedback token');
        }
        const body = { feedbackTokens: [feedbackToken] };
        const response = await this.actions.execute('/feedback', body);
        const data = response.data;
        if (!data.feedbackResponses[0].isProcessed) {
            throw new Error('Failed to remove video from watch history');
        }
        return true;
    }
}
//# sourceMappingURL=History.js.map