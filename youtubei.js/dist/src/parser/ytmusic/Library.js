var _Library_page, _Library_actions, _Library_continuation, _LibraryContinuation_page, _LibraryContinuation_actions, _LibraryContinuation_continuation;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser, GridContinuation, MusicShelfContinuation, SectionListContinuation } from '../index.js';
import Grid from '../classes/Grid.js';
import MusicShelf from '../classes/MusicShelf.js';
import MusicSideAlignedItem from '../classes/MusicSideAlignedItem.js';
import NavigationEndpoint from '../classes/NavigationEndpoint.js';
import SectionList from '../classes/SectionList.js';
import ChipCloud from '../classes/ChipCloud.js';
import MusicMultiSelectMenuItem from '../classes/menus/MusicMultiSelectMenuItem.js';
import MusicSortFilterButton from '../classes/MusicSortFilterButton.js';
import { InnertubeError } from '../../utils/Utils.js';
class Library {
    constructor(response, actions) {
        _Library_page.set(this, void 0);
        _Library_actions.set(this, void 0);
        _Library_continuation.set(this, void 0);
        __classPrivateFieldSet(this, _Library_page, Parser.parseResponse(response.data), "f");
        __classPrivateFieldSet(this, _Library_actions, actions, "f");
        const section_list = __classPrivateFieldGet(this, _Library_page, "f").contents_memo?.getType(SectionList)[0];
        this.header = section_list?.header?.as(MusicSideAlignedItem);
        this.contents = section_list?.contents?.as(Grid, MusicShelf);
        __classPrivateFieldSet(this, _Library_continuation, this.contents?.find((list) => list.continuation)?.continuation, "f");
    }
    /**
     * Applies given sort option to the library items.
     */
    async applySort(sort_by) {
        let target_item;
        if (typeof sort_by === 'string') {
            const button = __classPrivateFieldGet(this, _Library_page, "f").contents_memo?.getType(MusicSortFilterButton)[0];
            const options = button?.menu?.options
                .filter((item) => item instanceof MusicMultiSelectMenuItem);
            target_item = options?.find((item) => item.title === sort_by);
            if (!target_item)
                throw new InnertubeError(`Sort option "${sort_by}" not found`, { available_filters: options.map((item) => item.title) });
        }
        else {
            target_item = sort_by;
        }
        if (!target_item.endpoint)
            throw new InnertubeError('Invalid sort option');
        if (target_item.selected)
            return this;
        const cmd = target_item.endpoint.payload?.commands?.find((cmd) => cmd.browseSectionListReloadEndpoint)?.browseSectionListReloadEndpoint;
        if (!cmd)
            throw new InnertubeError('Failed to find sort option command');
        const response = await __classPrivateFieldGet(this, _Library_actions, "f").execute('/browse', {
            client: 'YTMUSIC',
            continuation: cmd.continuation.reloadContinuationData.continuation,
            parse: true
        });
        const previously_selected_item = __classPrivateFieldGet(this, _Library_page, "f").contents_memo?.getType(MusicMultiSelectMenuItem)?.find((item) => item.selected);
        if (previously_selected_item)
            previously_selected_item.selected = false;
        target_item.selected = true;
        this.contents = response.continuation_contents?.as(SectionListContinuation).contents?.as(Grid, MusicShelf);
        return this;
    }
    /**
     * Applies given filter to the library.
     */
    async applyFilter(filter) {
        let target_chip;
        const chip_cloud = __classPrivateFieldGet(this, _Library_page, "f").contents_memo?.getType(ChipCloud)[0];
        if (typeof filter === 'string') {
            target_chip = chip_cloud?.chips.get({ text: filter });
            if (!target_chip)
                throw new InnertubeError(`Filter "${filter}" not found`, { available_filters: this.filters });
        }
        else {
            target_chip = filter;
        }
        if (!target_chip.endpoint)
            throw new InnertubeError('Invalid filter', filter);
        const target_cmd = new NavigationEndpoint(target_chip.endpoint.payload?.commands?.[0]);
        const response = await target_cmd.call(__classPrivateFieldGet(this, _Library_actions, "f"), { client: 'YTMUSIC' });
        return new Library(response, __classPrivateFieldGet(this, _Library_actions, "f"));
    }
    /**
     * Retrieves continuation of the library items.
     */
    async getContinuation() {
        if (!__classPrivateFieldGet(this, _Library_continuation, "f"))
            throw new InnertubeError('No continuation available');
        const page = await __classPrivateFieldGet(this, _Library_actions, "f").execute('/browse', {
            client: 'YTMUSIC',
            continuation: __classPrivateFieldGet(this, _Library_continuation, "f")
        });
        return new LibraryContinuation(page, __classPrivateFieldGet(this, _Library_actions, "f"));
    }
    get has_continuation() {
        return !!__classPrivateFieldGet(this, _Library_continuation, "f");
    }
    get sort_options() {
        const button = __classPrivateFieldGet(this, _Library_page, "f").contents_memo?.getType(MusicSortFilterButton)[0];
        const options = button?.menu?.options.filter((item) => item instanceof MusicMultiSelectMenuItem);
        return options.map((item) => item.title);
    }
    get filters() {
        return __classPrivateFieldGet(this, _Library_page, "f").contents_memo?.getType(ChipCloud)?.[0].chips.map((chip) => chip.text) || [];
    }
    get page() {
        return __classPrivateFieldGet(this, _Library_page, "f");
    }
}
_Library_page = new WeakMap(), _Library_actions = new WeakMap(), _Library_continuation = new WeakMap();
export default Library;
export class LibraryContinuation {
    constructor(response, actions) {
        _LibraryContinuation_page.set(this, void 0);
        _LibraryContinuation_actions.set(this, void 0);
        _LibraryContinuation_continuation.set(this, void 0);
        __classPrivateFieldSet(this, _LibraryContinuation_page, Parser.parseResponse(response.data), "f");
        __classPrivateFieldSet(this, _LibraryContinuation_actions, actions, "f");
        if (!__classPrivateFieldGet(this, _LibraryContinuation_page, "f").continuation_contents)
            throw new InnertubeError('No continuation contents found');
        this.contents = __classPrivateFieldGet(this, _LibraryContinuation_page, "f").continuation_contents.as(MusicShelfContinuation, GridContinuation);
        __classPrivateFieldSet(this, _LibraryContinuation_continuation, this.contents.continuation || null, "f");
    }
    async getContinuation() {
        if (!__classPrivateFieldGet(this, _LibraryContinuation_continuation, "f"))
            throw new InnertubeError('No continuation available');
        const response = await __classPrivateFieldGet(this, _LibraryContinuation_actions, "f").execute('/browse', {
            client: 'YTMUSIC',
            continuation: __classPrivateFieldGet(this, _LibraryContinuation_continuation, "f")
        });
        return new LibraryContinuation(response, __classPrivateFieldGet(this, _LibraryContinuation_actions, "f"));
    }
    get has_continuation() {
        return !!__classPrivateFieldGet(this, _LibraryContinuation_continuation, "f");
    }
    get page() {
        return __classPrivateFieldGet(this, _LibraryContinuation_page, "f");
    }
}
_LibraryContinuation_page = new WeakMap(), _LibraryContinuation_actions = new WeakMap(), _LibraryContinuation_continuation = new WeakMap();
//# sourceMappingURL=Library.js.map