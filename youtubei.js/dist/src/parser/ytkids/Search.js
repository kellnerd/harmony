import Feed from '../../core/mixins/Feed.js';
import ItemSection from '../classes/ItemSection.js';
import { InnertubeError } from '../../utils/Utils.js';
export default class Search extends Feed {
    constructor(actions, data) {
        super(actions, data);
        this.estimated_results = this.page.estimated_results;
        const item_section = this.memo.getType(ItemSection)[0];
        if (!item_section)
            throw new InnertubeError('No item section found in search response.');
        this.contents = item_section.contents;
    }
}
//# sourceMappingURL=Search.js.map