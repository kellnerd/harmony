import { Parser } from '../index.js';
import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import SubFeedOption from './SubFeedOption.js';
class SubFeedSelector extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.options = Parser.parseArray(data.options, SubFeedOption);
    }
}
SubFeedSelector.type = 'SubFeedSelector';
export default SubFeedSelector;
//# sourceMappingURL=SubFeedSelector.js.map