import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ItemSectionHeader from './ItemSectionHeader.js';
import ItemSectionTabbedHeader from './ItemSectionTabbedHeader.js';
import CommentsHeader from './comments/CommentsHeader.js';
import SortFilterHeader from './SortFilterHeader.js';
import FeedFilterChipBar from './FeedFilterChipBar.js';
class ItemSection extends YTNode {
    constructor(data) {
        super();
        this.header = Parser.parseItem(data.header, [CommentsHeader, ItemSectionHeader, ItemSectionTabbedHeader, SortFilterHeader, FeedFilterChipBar]);
        this.contents = Parser.parseArray(data.contents);
        if (data.targetId || data.sectionIdentifier) {
            this.target_id = data.targetId || data.sectionIdentifier;
        }
        if (data.continuations) {
            this.continuation = data.continuations?.at(0)?.nextContinuationData?.continuation;
        }
    }
}
ItemSection.type = 'ItemSection';
export default ItemSection;
//# sourceMappingURL=ItemSection.js.map