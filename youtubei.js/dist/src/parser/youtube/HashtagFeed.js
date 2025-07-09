import { InnertubeError } from '../../utils/Utils.js';
import FilterableFeed from '../../core/mixins/FilterableFeed.js';
import HashtagHeader from '../classes/HashtagHeader.js';
import RichGrid from '../classes/RichGrid.js';
import PageHeader from '../classes/PageHeader.js';
import Tab from '../classes/Tab.js';
export default class HashtagFeed extends FilterableFeed {
    constructor(actions, response) {
        super(actions, response);
        if (!this.page.contents_memo)
            throw new InnertubeError('Unexpected response', this.page);
        const tab = this.page.contents_memo.getType(Tab)[0];
        if (!tab.content)
            throw new InnertubeError('Content tab has no content', tab);
        if (this.page.header) {
            this.header = this.page.header.item().as(HashtagHeader, PageHeader);
        }
        this.contents = tab.content.as(RichGrid);
    }
    /**
     * Applies given filter and returns a new {@link HashtagFeed} object. Use {@link HashtagFeed.filters} to get available filters.
     * @param filter - Filter to apply.
     */
    async applyFilter(filter) {
        const response = await super.getFilteredFeed(filter);
        return new HashtagFeed(this.actions, response.page);
    }
}
//# sourceMappingURL=HashtagFeed.js.map