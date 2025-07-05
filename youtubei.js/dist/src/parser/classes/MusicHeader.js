import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class MusicHeader extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'header')) {
            this.header = Parser.parseItem(data.header);
        }
        if (Reflect.has(data, 'title')) {
            this.title = new Text(data.title);
        }
    }
}
MusicHeader.type = 'MusicHeader';
export default MusicHeader;
//# sourceMappingURL=MusicHeader.js.map