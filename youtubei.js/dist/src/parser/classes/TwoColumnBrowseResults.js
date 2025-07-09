import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import SectionList from './SectionList.js';
import BrowseFeedActions from './BrowseFeedActions.js';
import ProfileColumn from './ProfileColumn.js';
import Tab from './Tab.js';
import ExpandableTab from './ExpandableTab.js';
class TwoColumnBrowseResults extends YTNode {
    constructor(data) {
        super();
        this.tabs = Parser.parseArray(data.tabs, [Tab, ExpandableTab]);
        this.secondary_contents = Parser.parseItem(data.secondaryContents, [SectionList, BrowseFeedActions, ProfileColumn]);
    }
}
TwoColumnBrowseResults.type = 'TwoColumnBrowseResults';
export default TwoColumnBrowseResults;
//# sourceMappingURL=TwoColumnBrowseResults.js.map