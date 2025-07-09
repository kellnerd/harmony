import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import SearchFilterGroup from './SearchFilterGroup.js';
import Text from './misc/Text.js';
class SearchFilterOptionsDialog extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.groups = Parser.parseArray(data.groups, SearchFilterGroup);
    }
}
SearchFilterOptionsDialog.type = 'SearchFilterOptionsDialog';
export default SearchFilterOptionsDialog;
//# sourceMappingURL=SearchFilterOptionsDialog.js.map