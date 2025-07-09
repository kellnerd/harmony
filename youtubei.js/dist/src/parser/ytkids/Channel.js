import Feed from '../../core/mixins/Feed.js';
import C4TabbedHeader from '../classes/C4TabbedHeader.js';
import ItemSection from '../classes/ItemSection.js';
import { ItemSectionContinuation } from '../index.js';
import NavigationEndpoint from '../classes/NavigationEndpoint.js';
export default class Channel extends Feed {
    constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
        this.header = this.page.header?.item().as(C4TabbedHeader);
        this.contents = this.memo.getType(ItemSection)[0] || this.page.continuation_contents?.as(ItemSectionContinuation);
    }
    /**
     * Retrieves next batch of content.
     */
    async getContinuation() {
        if (!this.contents)
            throw new Error('No continuation available.');
        const continuation_request = new NavigationEndpoint({
            continuationCommand: {
                token: this.contents.continuation,
                request: 'CONTINUATION_REQUEST_TYPE_BROWSE'
            }
        });
        const continuation_response = await continuation_request.call(this.actions, { client: 'YTKIDS' });
        return new Channel(this.actions, continuation_response);
    }
    get has_continuation() {
        return !!this.contents?.continuation;
    }
}
//# sourceMappingURL=Channel.js.map