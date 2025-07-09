import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ChipCloudChip from './ChipCloudChip.js';
class FeedFilterChipBar extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents, ChipCloudChip);
    }
}
FeedFilterChipBar.type = 'FeedFilterChipBar';
export default FeedFilterChipBar;
//# sourceMappingURL=FeedFilterChipBar.js.map