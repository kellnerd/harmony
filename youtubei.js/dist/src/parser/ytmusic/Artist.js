var _Artist_page, _Artist_actions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser } from '../index.js';
import { observe } from '../helpers.js';
import { InnertubeError } from '../../utils/Utils.js';
import MusicShelf from '../classes/MusicShelf.js';
import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicPlaylistShelf from '../classes/MusicPlaylistShelf.js';
import MusicImmersiveHeader from '../classes/MusicImmersiveHeader.js';
import MusicVisualHeader from '../classes/MusicVisualHeader.js';
import MusicHeader from '../classes/MusicHeader.js';
class Artist {
    constructor(response, actions) {
        _Artist_page.set(this, void 0);
        _Artist_actions.set(this, void 0);
        __classPrivateFieldSet(this, _Artist_page, Parser.parseResponse(response.data), "f");
        __classPrivateFieldSet(this, _Artist_actions, actions, "f");
        this.header = this.page.header?.item().as(MusicImmersiveHeader, MusicVisualHeader, MusicHeader);
        const music_shelf = __classPrivateFieldGet(this, _Artist_page, "f").contents_memo?.getType(MusicShelf) || [];
        const music_carousel_shelf = __classPrivateFieldGet(this, _Artist_page, "f").contents_memo?.getType(MusicCarouselShelf) || [];
        this.sections = observe([...music_shelf, ...music_carousel_shelf]);
    }
    async getAllSongs() {
        const music_shelves = this.sections.filter((section) => section.type === 'MusicShelf');
        if (!music_shelves.length)
            throw new InnertubeError('Could not find any node of type MusicShelf.');
        const shelf = music_shelves.find((shelf) => shelf.title.toString() === 'Songs');
        if (!shelf)
            throw new InnertubeError('Could not find target shelf (Songs).');
        if (!shelf.endpoint)
            throw new InnertubeError('Target shelf (Songs) did not have an endpoint.');
        const page = await shelf.endpoint.call(__classPrivateFieldGet(this, _Artist_actions, "f"), { client: 'YTMUSIC', parse: true });
        return page.contents_memo?.getType(MusicPlaylistShelf)?.[0];
    }
    get page() {
        return __classPrivateFieldGet(this, _Artist_page, "f");
    }
}
_Artist_page = new WeakMap(), _Artist_actions = new WeakMap();
export default Artist;
//# sourceMappingURL=Artist.js.map