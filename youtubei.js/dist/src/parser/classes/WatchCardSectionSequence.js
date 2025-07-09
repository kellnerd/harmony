import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class WatchCardSectionSequence extends YTNode {
    constructor(data) {
        super();
        this.lists = Parser.parseArray(data.lists);
    }
}
WatchCardSectionSequence.type = 'WatchCardSectionSequence';
export default WatchCardSectionSequence;
//# sourceMappingURL=WatchCardSectionSequence.js.map