var _Recap_page, _Recap_actions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser } from '../index.js';
import { InnertubeError } from '../../utils/Utils.js';
import Playlist from './Playlist.js';
import HighlightsCarousel from '../classes/HighlightsCarousel.js';
import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicElementHeader from '../classes/MusicElementHeader.js';
import MusicHeader from '../classes/MusicHeader.js';
import SingleColumnBrowseResults from '../classes/SingleColumnBrowseResults.js';
import ItemSection from '../classes/ItemSection.js';
import Message from '../classes/Message.js';
import SectionList from '../classes/SectionList.js';
import Tab from '../classes/Tab.js';
class Recap {
    constructor(response, actions) {
        _Recap_page.set(this, void 0);
        _Recap_actions.set(this, void 0);
        __classPrivateFieldSet(this, _Recap_page, Parser.parseResponse(response.data), "f");
        __classPrivateFieldSet(this, _Recap_actions, actions, "f");
        const header = __classPrivateFieldGet(this, _Recap_page, "f").header?.item();
        this.header = header?.is(MusicElementHeader) ?
            __classPrivateFieldGet(this, _Recap_page, "f").header?.item().as(MusicElementHeader).element?.model?.as(HighlightsCarousel) :
            __classPrivateFieldGet(this, _Recap_page, "f").header?.item().as(MusicHeader);
        const tab = __classPrivateFieldGet(this, _Recap_page, "f").contents?.item().as(SingleColumnBrowseResults).tabs.firstOfType(Tab);
        if (!tab)
            throw new InnertubeError('Target tab not found');
        this.sections = tab.content?.as(SectionList).contents.as(ItemSection, MusicCarouselShelf, Message);
    }
    /**
     * Retrieves recap playlist.
     */
    async getPlaylist() {
        if (!this.header)
            throw new InnertubeError('Header not found');
        if (!this.header.is(HighlightsCarousel))
            throw new InnertubeError('Recap playlist not available, check back later.');
        const endpoint = this.header.panels[0].text_on_tap_endpoint;
        const response = await endpoint.call(__classPrivateFieldGet(this, _Recap_actions, "f"), { client: 'YTMUSIC' });
        return new Playlist(response, __classPrivateFieldGet(this, _Recap_actions, "f"));
    }
    get page() {
        return __classPrivateFieldGet(this, _Recap_page, "f");
    }
}
_Recap_page = new WeakMap(), _Recap_actions = new WeakMap();
export default Recap;
//# sourceMappingURL=Recap.js.map