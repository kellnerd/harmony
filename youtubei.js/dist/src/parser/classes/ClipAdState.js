import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class ClipAdState extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.body = new Text(data.body);
    }
}
ClipAdState.type = 'ClipAdState';
export default ClipAdState;
//# sourceMappingURL=ClipAdState.js.map