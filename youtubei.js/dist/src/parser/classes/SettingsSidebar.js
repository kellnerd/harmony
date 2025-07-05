import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import CompactLink from './CompactLink.js';
import Text from './misc/Text.js';
class SettingsSidebar extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.items = Parser.parseArray(data.items, CompactLink);
    }
    // XXX: Alias for consistency.
    get contents() {
        return this.items;
    }
}
SettingsSidebar.type = 'SettingsSidebar';
export default SettingsSidebar;
//# sourceMappingURL=SettingsSidebar.js.map