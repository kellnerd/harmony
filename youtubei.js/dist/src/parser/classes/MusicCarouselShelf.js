import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import MusicCarouselShelfBasicHeader from './MusicCarouselShelfBasicHeader.js';
import MusicMultiRowListItem from './MusicMultiRowListItem.js';
import MusicNavigationButton from './MusicNavigationButton.js';
import MusicResponsiveListItem from './MusicResponsiveListItem.js';
import MusicTwoRowItem from './MusicTwoRowItem.js';
class MusicCarouselShelf extends YTNode {
    constructor(data) {
        super();
        this.header = Parser.parseItem(data.header, MusicCarouselShelfBasicHeader);
        this.contents = Parser.parseArray(data.contents, [MusicTwoRowItem, MusicResponsiveListItem, MusicMultiRowListItem, MusicNavigationButton]);
        if (Reflect.has(data, 'numItemsPerColumn')) {
            this.num_items_per_column = parseInt(data.numItemsPerColumn);
        }
    }
}
MusicCarouselShelf.type = 'MusicCarouselShelf';
export default MusicCarouselShelf;
//# sourceMappingURL=MusicCarouselShelf.js.map