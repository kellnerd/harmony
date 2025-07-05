var _Explore_page;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser } from '../index.js';
import { InnertubeError } from '../../utils/Utils.js';
import Grid from '../classes/Grid.js';
import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicNavigationButton from '../classes/MusicNavigationButton.js';
import SectionList from '../classes/SectionList.js';
import SingleColumnBrowseResults from '../classes/SingleColumnBrowseResults.js';
class Explore {
    constructor(response) {
        _Explore_page.set(this, void 0);
        __classPrivateFieldSet(this, _Explore_page, Parser.parseResponse(response.data), "f");
        const tab = __classPrivateFieldGet(this, _Explore_page, "f").contents?.item().as(SingleColumnBrowseResults).tabs.get({ selected: true });
        if (!tab)
            throw new InnertubeError('Could not find target tab.');
        const section_list = tab.content?.as(SectionList);
        if (!section_list)
            throw new InnertubeError('Target tab did not have any content.');
        this.top_buttons = section_list.contents.firstOfType(Grid)?.items.as(MusicNavigationButton) || [];
        this.sections = section_list.contents.filterType(MusicCarouselShelf);
    }
    get page() {
        return __classPrivateFieldGet(this, _Explore_page, "f");
    }
}
_Explore_page = new WeakMap();
export default Explore;
//# sourceMappingURL=Explore.js.map