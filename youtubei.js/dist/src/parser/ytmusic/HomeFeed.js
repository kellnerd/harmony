var _HomeFeed_page, _HomeFeed_actions, _HomeFeed_continuation;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { InnertubeError } from '../../utils/Utils.js';
import { Parser, SectionListContinuation } from '../index.js';
import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import SectionList from '../classes/SectionList.js';
import SingleColumnBrowseResults from '../classes/SingleColumnBrowseResults.js';
import MusicTastebuilderShelf from '../classes/MusicTastebuilderShelf.js';
import ChipCloud from '../classes/ChipCloud.js';
import ChipCloudChip from '../classes/ChipCloudChip.js';
class HomeFeed {
    constructor(response, actions) {
        _HomeFeed_page.set(this, void 0);
        _HomeFeed_actions.set(this, void 0);
        _HomeFeed_continuation.set(this, void 0);
        __classPrivateFieldSet(this, _HomeFeed_actions, actions, "f");
        __classPrivateFieldSet(this, _HomeFeed_page, Parser.parseResponse(response.data), "f");
        const tab = __classPrivateFieldGet(this, _HomeFeed_page, "f").contents?.item().as(SingleColumnBrowseResults).tabs.get({ selected: true });
        if (!tab)
            throw new InnertubeError('Could not find Home tab.');
        if (tab.content === null) {
            if (!__classPrivateFieldGet(this, _HomeFeed_page, "f").continuation_contents)
                throw new InnertubeError('Continuation did not have any content.');
            __classPrivateFieldSet(this, _HomeFeed_continuation, __classPrivateFieldGet(this, _HomeFeed_page, "f").continuation_contents.as(SectionListContinuation).continuation, "f");
            this.sections = __classPrivateFieldGet(this, _HomeFeed_page, "f").continuation_contents.as(SectionListContinuation).contents?.as(MusicCarouselShelf);
            return;
        }
        this.header = tab.content?.as(SectionList).header?.as(ChipCloud);
        __classPrivateFieldSet(this, _HomeFeed_continuation, tab.content?.as(SectionList).continuation, "f");
        this.sections = tab.content?.as(SectionList).contents.as(MusicCarouselShelf, MusicTastebuilderShelf);
    }
    /**
     * Retrieves home feed continuation.
     */
    async getContinuation() {
        if (!__classPrivateFieldGet(this, _HomeFeed_continuation, "f"))
            throw new InnertubeError('Continuation not found.');
        const response = await __classPrivateFieldGet(this, _HomeFeed_actions, "f").execute('/browse', {
            client: 'YTMUSIC',
            continuation: __classPrivateFieldGet(this, _HomeFeed_continuation, "f")
        });
        return new HomeFeed(response, __classPrivateFieldGet(this, _HomeFeed_actions, "f"));
    }
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
        const response = await cloud_chip.endpoint.call(__classPrivateFieldGet(this, _HomeFeed_actions, "f"), { client: 'YTMUSIC' });
        return new HomeFeed(response, __classPrivateFieldGet(this, _HomeFeed_actions, "f"));
    }
    get filters() {
        return this.header?.chips?.as(ChipCloudChip).map((chip) => chip.text) || [];
    }
    get has_continuation() {
        return !!__classPrivateFieldGet(this, _HomeFeed_continuation, "f");
    }
    get page() {
        return __classPrivateFieldGet(this, _HomeFeed_page, "f");
    }
}
_HomeFeed_page = new WeakMap(), _HomeFeed_actions = new WeakMap(), _HomeFeed_continuation = new WeakMap();
export default HomeFeed;
//# sourceMappingURL=HomeFeed.js.map