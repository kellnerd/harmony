import { Parser } from '../../index.js';
import { YTNode } from '../../helpers.js';
import MultiPageMenu from '../menus/MultiPageMenu.js';
class GetMultiPageMenuAction extends YTNode {
    constructor(data) {
        super();
        this.menu = Parser.parseItem(data.menu, MultiPageMenu);
    }
}
GetMultiPageMenuAction.type = 'GetMultiPageMenuAction';
export default GetMultiPageMenuAction;
//# sourceMappingURL=GetMultiPageMenuAction.js.map