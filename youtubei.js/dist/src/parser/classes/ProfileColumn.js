import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class ProfileColumn extends YTNode {
    constructor(data) {
        super();
        this.items = Parser.parseArray(data.items);
    }
    // XXX: Alias for consistency.
    get contents() {
        return this.items;
    }
}
ProfileColumn.type = 'ProfileColumn';
export default ProfileColumn;
//# sourceMappingURL=ProfileColumn.js.map