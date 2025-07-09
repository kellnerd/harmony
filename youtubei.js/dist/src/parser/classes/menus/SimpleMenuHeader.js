import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
import Button from '../Button.js';
import Text from '../misc/Text.js';
class SimpleMenuHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.buttons = Parser.parseArray(data.buttons, Button);
    }
}
SimpleMenuHeader.type = 'SimpleMenuHeader';
export default SimpleMenuHeader;
//# sourceMappingURL=SimpleMenuHeader.js.map