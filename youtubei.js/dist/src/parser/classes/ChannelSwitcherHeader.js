import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import { Text } from '../misc.js';
import Button from './Button.js';
class ChannelSwitcherHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title).toString();
        if (Reflect.has(data, 'button')) {
            this.button = Parser.parseItem(data.button, Button);
        }
    }
}
ChannelSwitcherHeader.type = 'ChannelSwitcherHeader';
export default ChannelSwitcherHeader;
//# sourceMappingURL=ChannelSwitcherHeader.js.map