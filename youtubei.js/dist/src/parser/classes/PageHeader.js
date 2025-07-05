import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import PageHeaderView from './PageHeaderView.js';
class PageHeader extends YTNode {
    constructor(data) {
        super();
        this.page_title = data.pageTitle;
        this.content = Parser.parseItem(data.content, PageHeaderView);
    }
}
PageHeader.type = 'PageHeader';
export default PageHeader;
//# sourceMappingURL=PageHeader.js.map