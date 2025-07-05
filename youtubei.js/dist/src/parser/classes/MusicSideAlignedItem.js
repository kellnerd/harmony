import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class MusicSideAlignedItem extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'startItems')) {
            this.start_items = Parser.parseArray(data.startItems);
        }
        if (Reflect.has(data, 'endItems')) {
            this.end_items = Parser.parseArray(data.endItems);
        }
    }
}
MusicSideAlignedItem.type = 'MusicSideAlignedItem';
export default MusicSideAlignedItem;
//# sourceMappingURL=MusicSideAlignedItem.js.map