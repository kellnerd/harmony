import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import UniversalWatchCard from './UniversalWatchCard.js';
class SecondarySearchContainer extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents, [UniversalWatchCard]);
    }
}
SecondarySearchContainer.type = 'SecondarySearchContainer';
export default SecondarySearchContainer;
//# sourceMappingURL=SecondarySearchContainer.js.map