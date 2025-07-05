import { Parser } from '../index.js';
import AccountItem from './AccountItem.js';
import AccountItemSectionHeader from './AccountItemSectionHeader.js';
import { YTNode } from '../helpers.js';
import CompactLink from './CompactLink.js';
class AccountItemSection extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents, [AccountItem, CompactLink]);
        this.header = Parser.parseItem(data.header, AccountItemSectionHeader);
    }
}
AccountItemSection.type = 'AccountItemSection';
export default AccountItemSection;
//# sourceMappingURL=AccountItemSection.js.map