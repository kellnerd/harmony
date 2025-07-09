import Text from './misc/Text.js';
import * as Parser from '../parser.js';
import { YTNode } from '../helpers.js';
class GuideSection extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'formattedTitle')) {
            this.title = new Text(data.formattedTitle);
        }
        this.items = Parser.parseArray(data.items);
    }
}
GuideSection.type = 'GuideSection';
export default GuideSection;
//# sourceMappingURL=GuideSection.js.map