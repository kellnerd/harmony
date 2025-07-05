import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class ContinuationItem extends YTNode {
    constructor(data) {
        super();
        this.trigger = data.trigger;
        if (Reflect.has(data, 'button')) {
            this.button = Parser.parseItem(data.button, Button);
        }
        this.endpoint = new NavigationEndpoint(data.continuationEndpoint);
    }
}
ContinuationItem.type = 'ContinuationItem';
export default ContinuationItem;
//# sourceMappingURL=ContinuationItem.js.map