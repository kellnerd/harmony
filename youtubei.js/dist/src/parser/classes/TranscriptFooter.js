import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import SortFilterSubMenu from './SortFilterSubMenu.js';
class TranscriptFooter extends YTNode {
    constructor(data) {
        super();
        this.language_menu = Parser.parseItem(data.languageMenu, SortFilterSubMenu);
    }
}
TranscriptFooter.type = 'TranscriptFooter';
export default TranscriptFooter;
//# sourceMappingURL=TranscriptFooter.js.map