import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class SimpleCardTeaser extends YTNode {
    constructor(data) {
        super();
        this.message = new Text(data.message);
        this.prominent = data.prominent;
    }
}
SimpleCardTeaser.type = 'SimpleCardTeaser';
export default SimpleCardTeaser;
//# sourceMappingURL=SimpleCardTeaser.js.map