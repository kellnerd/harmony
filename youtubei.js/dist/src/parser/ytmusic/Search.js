var _Search_page, _Search_actions, _Search_continuation, _SearchContinuation_actions, _SearchContinuation_page;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { InnertubeError } from '../../utils/Utils.js';
import { Parser, MusicShelfContinuation } from '../index.js';
import ChipCloud from '../classes/ChipCloud.js';
import ChipCloudChip from '../classes/ChipCloudChip.js';
import DidYouMean from '../classes/DidYouMean.js';
import ItemSection from '../classes/ItemSection.js';
import Message from '../classes/Message.js';
import MusicCardShelf from '../classes/MusicCardShelf.js';
import MusicHeader from '../classes/MusicHeader.js';
import MusicShelf from '../classes/MusicShelf.js';
import SectionList from '../classes/SectionList.js';
import ShowingResultsFor from '../classes/ShowingResultsFor.js';
import TabbedSearchResults from '../classes/TabbedSearchResults.js';
class Search {
    constructor(response, actions, is_filtered) {
        _Search_page.set(this, void 0);
        _Search_actions.set(this, void 0);
        _Search_continuation.set(this, void 0);
        __classPrivateFieldSet(this, _Search_actions, actions, "f");
        __classPrivateFieldSet(this, _Search_page, Parser.parseResponse(response.data), "f");
        if (!__classPrivateFieldGet(this, _Search_page, "f").contents || !__classPrivateFieldGet(this, _Search_page, "f").contents_memo)
            throw new InnertubeError('Response did not contain any contents.');
        const tab = __classPrivateFieldGet(this, _Search_page, "f").contents.item().as(TabbedSearchResults).tabs.get({ selected: true });
        if (!tab)
            throw new InnertubeError('Could not find target tab.');
        const tab_content = tab.content?.as(SectionList);
        if (!tab_content)
            throw new InnertubeError('Target tab did not have any content.');
        this.header = tab_content.header?.as(ChipCloud);
        this.contents = tab_content.contents.as(MusicShelf, MusicCardShelf, ItemSection);
        if (is_filtered) {
            __classPrivateFieldSet(this, _Search_continuation, this.contents.firstOfType(MusicShelf)?.continuation, "f");
        }
    }
    /**
     * Loads more items for the given shelf.
     */
    async getMore(shelf) {
        if (!shelf || !shelf.endpoint)
            throw new InnertubeError('Cannot retrieve more items for this shelf because it does not have an endpoint.');
        const response = await shelf.endpoint.call(__classPrivateFieldGet(this, _Search_actions, "f"), { client: 'YTMUSIC' });
        if (!response)
            throw new InnertubeError('Endpoint did not return any data');
        return new Search(response, __classPrivateFieldGet(this, _Search_actions, "f"), true);
    }
    /**
     * Retrieves search continuation. Only available for filtered searches and shelf continuations.
     */
    async getContinuation() {
        if (!__classPrivateFieldGet(this, _Search_continuation, "f"))
            throw new InnertubeError('Continuation not found.');
        const response = await __classPrivateFieldGet(this, _Search_actions, "f").execute('/search', {
            continuation: __classPrivateFieldGet(this, _Search_continuation, "f"),
            client: 'YTMUSIC'
        });
        return new SearchContinuation(__classPrivateFieldGet(this, _Search_actions, "f"), response);
    }
    /**
     * Applies given filter to the search.
     */
    async applyFilter(target_filter) {
        let cloud_chip;
        if (typeof target_filter === 'string') {
            cloud_chip = this.header?.chips?.as(ChipCloudChip).get({ text: target_filter });
            if (!cloud_chip)
                throw new InnertubeError('Could not find filter with given name.', { available_filters: this.filters });
        }
        else if (target_filter?.is(ChipCloudChip)) {
            cloud_chip = target_filter;
        }
        if (!cloud_chip)
            throw new InnertubeError('Invalid filter', { available_filters: this.filters });
        if (cloud_chip?.is_selected)
            return this;
        if (!cloud_chip.endpoint)
            throw new InnertubeError('Selected filter does not have an endpoint.');
        const response = await cloud_chip.endpoint.call(__classPrivateFieldGet(this, _Search_actions, "f"), { client: 'YTMUSIC' });
        return new Search(response, __classPrivateFieldGet(this, _Search_actions, "f"), true);
    }
    get filters() {
        return this.header?.chips?.as(ChipCloudChip).map((chip) => chip.text) || [];
    }
    get has_continuation() {
        return !!__classPrivateFieldGet(this, _Search_continuation, "f");
    }
    get did_you_mean() {
        return __classPrivateFieldGet(this, _Search_page, "f").contents_memo?.getType(DidYouMean)[0];
    }
    get showing_results_for() {
        return __classPrivateFieldGet(this, _Search_page, "f").contents_memo?.getType(ShowingResultsFor)[0];
    }
    get message() {
        return __classPrivateFieldGet(this, _Search_page, "f").contents_memo?.getType(Message)[0];
    }
    get songs() {
        return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === 'Songs');
    }
    get videos() {
        return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === 'Videos');
    }
    get albums() {
        return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === 'Albums');
    }
    get artists() {
        return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === 'Artists');
    }
    get playlists() {
        return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === 'Community playlists');
    }
    get page() {
        return __classPrivateFieldGet(this, _Search_page, "f");
    }
}
_Search_page = new WeakMap(), _Search_actions = new WeakMap(), _Search_continuation = new WeakMap();
export default Search;
export class SearchContinuation {
    constructor(actions, response) {
        _SearchContinuation_actions.set(this, void 0);
        _SearchContinuation_page.set(this, void 0);
        __classPrivateFieldSet(this, _SearchContinuation_actions, actions, "f");
        __classPrivateFieldSet(this, _SearchContinuation_page, Parser.parseResponse(response.data), "f");
        this.header = __classPrivateFieldGet(this, _SearchContinuation_page, "f").header?.item().as(MusicHeader);
        this.contents = __classPrivateFieldGet(this, _SearchContinuation_page, "f").continuation_contents?.as(MusicShelfContinuation);
    }
    async getContinuation() {
        if (!this.contents?.continuation)
            throw new InnertubeError('Continuation not found.');
        const response = await __classPrivateFieldGet(this, _SearchContinuation_actions, "f").execute('/search', {
            continuation: this.contents.continuation,
            client: 'YTMUSIC'
        });
        return new SearchContinuation(__classPrivateFieldGet(this, _SearchContinuation_actions, "f"), response);
    }
    get has_continuation() {
        return !!this.contents?.continuation;
    }
    get page() {
        return __classPrivateFieldGet(this, _SearchContinuation_page, "f");
    }
}
_SearchContinuation_actions = new WeakMap(), _SearchContinuation_page = new WeakMap();
//# sourceMappingURL=Search.js.map