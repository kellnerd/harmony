import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ChipView from './ChipView.js';
class ChipBarView extends YTNode {
    constructor(data) {
        super();
        this.chips = Parser.parseArray(data.chips, ChipView);
    }
}
ChipBarView.type = 'ChipBarView';
export default ChipBarView;
//# sourceMappingURL=ChipBarView.js.map