// noinspection ES6MissingAwait
var _Playlist_instances, _Playlist_page, _Playlist_actions, _Playlist_continuation, _Playlist_last_fetched_suggestions, _Playlist_suggestions_continuation, _Playlist_fetchSuggestions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { MusicPlaylistShelfContinuation, Parser, SectionListContinuation } from '../index.js';
import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicDetailHeader from '../classes/MusicDetailHeader.js';
import MusicEditablePlaylistDetailHeader from '../classes/MusicEditablePlaylistDetailHeader.js';
import MusicPlaylistShelf from '../classes/MusicPlaylistShelf.js';
import MusicShelf from '../classes/MusicShelf.js';
import SectionList from '../classes/SectionList.js';
import MusicResponsiveListItem from '../classes/MusicResponsiveListItem.js';
import MusicResponsiveHeader from '../classes/MusicResponsiveHeader.js';
import { InnertubeError } from '../../utils/Utils.js';
import { observe } from '../helpers.js';
import ContinuationItem from '../classes/ContinuationItem.js';
import AppendContinuationItemsAction from '../classes/actions/AppendContinuationItemsAction.js';
class Playlist {
    constructor(response, actions) {
        _Playlist_instances.add(this);
        _Playlist_page.set(this, void 0);
        _Playlist_actions.set(this, void 0);
        _Playlist_continuation.set(this, void 0);
        _Playlist_last_fetched_suggestions.set(this, void 0);
        _Playlist_suggestions_continuation.set(this, void 0);
        __classPrivateFieldSet(this, _Playlist_actions, actions, "f");
        __classPrivateFieldSet(this, _Playlist_page, Parser.parseResponse(response.data), "f");
        __classPrivateFieldSet(this, _Playlist_last_fetched_suggestions, null, "f");
        __classPrivateFieldSet(this, _Playlist_suggestions_continuation, null, "f");
        if (__classPrivateFieldGet(this, _Playlist_page, "f").continuation_contents) {
            const data = __classPrivateFieldGet(this, _Playlist_page, "f").continuation_contents?.as(MusicPlaylistShelfContinuation);
            if (!data.contents)
                throw new InnertubeError('No contents found in the response');
            this.contents = data.contents.as(MusicResponsiveListItem, ContinuationItem);
            const continuation_item = this.contents.firstOfType(ContinuationItem);
            __classPrivateFieldSet(this, _Playlist_continuation, data.continuation || continuation_item, "f");
        }
        else if (__classPrivateFieldGet(this, _Playlist_page, "f").contents_memo) {
            this.header = __classPrivateFieldGet(this, _Playlist_page, "f").contents_memo.getType(MusicResponsiveHeader, MusicEditablePlaylistDetailHeader, MusicDetailHeader)?.[0];
            this.contents = __classPrivateFieldGet(this, _Playlist_page, "f").contents_memo.getType(MusicPlaylistShelf)?.[0]?.contents.as(MusicResponsiveListItem, ContinuationItem) || observe([]);
            this.background = __classPrivateFieldGet(this, _Playlist_page, "f").background;
            const continuation_item = this.contents.firstOfType(ContinuationItem);
            __classPrivateFieldSet(this, _Playlist_continuation, __classPrivateFieldGet(this, _Playlist_page, "f").contents_memo.getType(MusicPlaylistShelf)?.[0]?.continuation || continuation_item, "f");
        }
        else if (__classPrivateFieldGet(this, _Playlist_page, "f").on_response_received_actions) {
            const append_continuation_action = __classPrivateFieldGet(this, _Playlist_page, "f").on_response_received_actions.firstOfType(AppendContinuationItemsAction);
            this.contents = append_continuation_action?.contents?.as(MusicResponsiveListItem, ContinuationItem);
            __classPrivateFieldSet(this, _Playlist_continuation, this.contents?.firstOfType(ContinuationItem), "f");
        }
    }
    /**
     * Retrieves playlist items continuation.
     */
    async getContinuation() {
        if (!__classPrivateFieldGet(this, _Playlist_continuation, "f"))
            throw new InnertubeError('Continuation not found.');
        let response;
        if (typeof __classPrivateFieldGet(this, _Playlist_continuation, "f") === 'string') {
            response = await __classPrivateFieldGet(this, _Playlist_actions, "f").execute('/browse', {
                client: 'YTMUSIC',
                continuation: __classPrivateFieldGet(this, _Playlist_continuation, "f")
            });
        }
        else {
            response = await __classPrivateFieldGet(this, _Playlist_continuation, "f").endpoint.call(__classPrivateFieldGet(this, _Playlist_actions, "f"), { client: 'YTMUSIC' });
        }
        return new Playlist(response, __classPrivateFieldGet(this, _Playlist_actions, "f"));
    }
    /**
     * Retrieves related playlists
     */
    async getRelated() {
        const target_section_list = __classPrivateFieldGet(this, _Playlist_page, "f").contents_memo?.getType(SectionList).find((section_list) => section_list.continuation);
        if (!target_section_list)
            throw new InnertubeError('Could not find "Related" section.');
        let section_continuation = target_section_list.continuation;
        while (section_continuation) {
            const data = await __classPrivateFieldGet(this, _Playlist_actions, "f").execute('/browse', {
                client: 'YTMUSIC',
                continuation: section_continuation,
                parse: true
            });
            const section_list = data.continuation_contents?.as(SectionListContinuation);
            const sections = section_list?.contents?.as(MusicCarouselShelf, MusicShelf);
            const related = sections?.find((section) => section.is(MusicCarouselShelf))?.as(MusicCarouselShelf);
            if (related)
                return related;
            section_continuation = section_list?.continuation;
        }
        throw new InnertubeError('Could not fetch related playlists.');
    }
    async getSuggestions(refresh = true) {
        const require_fetch = refresh || !__classPrivateFieldGet(this, _Playlist_last_fetched_suggestions, "f");
        const fetch_promise = require_fetch ? __classPrivateFieldGet(this, _Playlist_instances, "m", _Playlist_fetchSuggestions).call(this) : Promise.resolve(null);
        const fetch_result = await fetch_promise;
        if (fetch_result) {
            __classPrivateFieldSet(this, _Playlist_last_fetched_suggestions, fetch_result.items, "f");
            __classPrivateFieldSet(this, _Playlist_suggestions_continuation, fetch_result.continuation, "f");
        }
        return fetch_result?.items || __classPrivateFieldGet(this, _Playlist_last_fetched_suggestions, "f") || observe([]);
    }
    get page() {
        return __classPrivateFieldGet(this, _Playlist_page, "f");
    }
    get items() {
        return this.contents || observe([]);
    }
    get has_continuation() {
        return !!__classPrivateFieldGet(this, _Playlist_continuation, "f");
    }
}
_Playlist_page = new WeakMap(), _Playlist_actions = new WeakMap(), _Playlist_continuation = new WeakMap(), _Playlist_last_fetched_suggestions = new WeakMap(), _Playlist_suggestions_continuation = new WeakMap(), _Playlist_instances = new WeakSet(), _Playlist_fetchSuggestions = async function _Playlist_fetchSuggestions() {
    const target_section_list = __classPrivateFieldGet(this, _Playlist_page, "f").contents_memo?.getType(SectionList).find((section_list) => section_list.continuation);
    const continuation = __classPrivateFieldGet(this, _Playlist_suggestions_continuation, "f") || target_section_list?.continuation;
    if (continuation) {
        const page = await __classPrivateFieldGet(this, _Playlist_actions, "f").execute('/browse', {
            client: 'YTMUSIC',
            continuation: continuation,
            parse: true
        });
        const section_list = page.continuation_contents?.as(SectionListContinuation);
        const sections = section_list?.contents?.as(MusicCarouselShelf, MusicShelf);
        const suggestions = sections?.find((section) => section.is(MusicShelf))?.as(MusicShelf);
        return {
            items: suggestions?.contents || observe([]),
            continuation: suggestions?.continuation || null
        };
    }
    return {
        items: observe([]),
        continuation: null
    };
};
export default Playlist;
//# sourceMappingURL=Playlist.js.map