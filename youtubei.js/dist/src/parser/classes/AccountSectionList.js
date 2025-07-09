import { Parser } from '../index.js';
import AccountChannel from './AccountChannel.js';
import AccountItemSection from './AccountItemSection.js';
import { YTNode } from '../helpers.js';
class AccountSectionList extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents, AccountItemSection);
        this.footers = Parser.parseArray(data.footers, AccountChannel);
    }
}
AccountSectionList.type = 'AccountSectionList';
export default AccountSectionList;
//# sourceMappingURL=AccountSectionList.js.map