import * as Parser from '../parser.js';
import { YTNode } from '../helpers.js';
class GuideCollapsibleSectionEntry extends YTNode {
    constructor(data) {
        super();
        this.header_entry = Parser.parseItem(data.headerEntry);
        this.expander_icon = data.expanderIcon.iconType;
        this.collapser_icon = data.collapserIcon.iconType;
        this.section_items = Parser.parseArray(data.sectionItems);
    }
}
GuideCollapsibleSectionEntry.type = 'GuideCollapsibleSectionEntry';
export default GuideCollapsibleSectionEntry;
//# sourceMappingURL=GuideCollapsibleSectionEntry.js.map