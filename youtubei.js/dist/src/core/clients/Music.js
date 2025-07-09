var _Music_instances, _Music_session, _Music_actions, _Music_fetchInfoFromVideoId, _Music_fetchInfoFromEndpoint;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { generateRandomString, InnertubeError, throwIfMissing, u8ToBase64 } from '../../utils/Utils.js';
import { Album, Artist, Explore, HomeFeed, Library, Playlist, Recap, Search, TrackInfo } from '../../parser/ytmusic/index.js';
import AutomixPreviewVideo from '../../parser/classes/AutomixPreviewVideo.js';
import Message from '../../parser/classes/Message.js';
import MusicDescriptionShelf from '../../parser/classes/MusicDescriptionShelf.js';
import MusicQueue from '../../parser/classes/MusicQueue.js';
import MusicTwoRowItem from '../../parser/classes/MusicTwoRowItem.js';
import MusicResponsiveListItem from '../../parser/classes/MusicResponsiveListItem.js';
import NavigationEndpoint from '../../parser/classes/NavigationEndpoint.js';
import PlaylistPanel from '../../parser/classes/PlaylistPanel.js';
import SearchSuggestionsSection from '../../parser/classes/SearchSuggestionsSection.js';
import SectionList from '../../parser/classes/SectionList.js';
import Tab from '../../parser/classes/Tab.js';
import { SearchFilter } from '../../../protos/generated/misc/params.js';
class Music {
    constructor(session) {
        _Music_instances.add(this);
        _Music_session.set(this, void 0);
        _Music_actions.set(this, void 0);
        __classPrivateFieldSet(this, _Music_session, session, "f");
        __classPrivateFieldSet(this, _Music_actions, session.actions, "f");
    }
    /**
     * Retrieves track info. Passing a list item of type MusicTwoRowItem automatically starts a radio.
     * @param target - Video id or a list item.
     */
    getInfo(target) {
        if (target instanceof MusicTwoRowItem) {
            return __classPrivateFieldGet(this, _Music_instances, "m", _Music_fetchInfoFromEndpoint).call(this, target.endpoint);
        }
        else if (target instanceof MusicResponsiveListItem) {
            return __classPrivateFieldGet(this, _Music_instances, "m", _Music_fetchInfoFromEndpoint).call(this, target.overlay?.content?.endpoint ?? target.endpoint);
        }
        else if (target instanceof NavigationEndpoint) {
            return __classPrivateFieldGet(this, _Music_instances, "m", _Music_fetchInfoFromEndpoint).call(this, target);
        }
        return __classPrivateFieldGet(this, _Music_instances, "m", _Music_fetchInfoFromVideoId).call(this, target);
    }
    async search(query, filters = {}) {
        throwIfMissing({ query });
        let params;
        if (filters.type && filters.type !== 'all') {
            const writer = SearchFilter.encode({
                filters: {
                    musicSearchType: {
                        [filters.type]: true
                    }
                }
            });
            params = encodeURIComponent(u8ToBase64(writer.finish()));
        }
        const search_endpoint = new NavigationEndpoint({ searchEndpoint: { query, params } });
        const response = await search_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC' });
        return new Search(response, __classPrivateFieldGet(this, _Music_actions, "f"), Reflect.has(filters, 'type') && filters.type !== 'all');
    }
    async getHomeFeed() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEmusic_home' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC' });
        return new HomeFeed(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    async getExplore() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEmusic_explore' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC' });
        return new Explore(response);
        // TODO: return new Explore(response, this.#actions);
    }
    async getLibrary() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEmusic_library_landing' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC' });
        return new Library(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    async getArtist(artist_id) {
        if (!artist_id || !artist_id.startsWith('UC') && !artist_id.startsWith('FEmusic_library_privately_owned_artist'))
            throw new InnertubeError('Invalid artist id', artist_id);
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: artist_id } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC' });
        return new Artist(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    async getAlbum(album_id) {
        if (!album_id || !album_id.startsWith('MPR') && !album_id.startsWith('FEmusic_library_privately_owned_release'))
            throw new InnertubeError('Invalid album id', album_id);
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: album_id } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC' });
        return new Album(response);
    }
    async getPlaylist(playlist_id) {
        if (!playlist_id.startsWith('VL'))
            playlist_id = `VL${playlist_id}`;
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: playlist_id } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC' });
        return new Playlist(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    async getUpNext(video_id, automix = true) {
        throwIfMissing({ video_id });
        const watch_next_endpoint = new NavigationEndpoint({ watchNextEndpoint: { videoId: video_id } });
        const response = await watch_next_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC', parse: true });
        const tabs = response.contents_memo?.getType(Tab);
        const tab = tabs?.[0];
        if (!tab)
            throw new InnertubeError('Could not find target tab.');
        const music_queue = tab.content?.as(MusicQueue);
        if (!music_queue || !music_queue.content)
            throw new InnertubeError('Music queue was empty, the given id is probably invalid.', music_queue);
        const playlist_panel = music_queue.content.as(PlaylistPanel);
        if (!playlist_panel.playlist_id && automix) {
            const automix_preview_video = playlist_panel.contents.firstOfType(AutomixPreviewVideo);
            if (!automix_preview_video)
                throw new InnertubeError('Automix item not found');
            const page = await automix_preview_video.playlist_video?.endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), {
                videoId: video_id,
                client: 'YTMUSIC',
                parse: true
            });
            if (!page || !page.contents_memo)
                throw new InnertubeError('Could not fetch automix');
            return page.contents_memo.getType(PlaylistPanel)[0];
        }
        return playlist_panel;
    }
    async getRelated(video_id) {
        throwIfMissing({ video_id });
        const watch_next_endpoint = new NavigationEndpoint({ watchNextEndpoint: { videoId: video_id } });
        const response = await watch_next_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC', parse: true });
        const tabs = response.contents_memo?.getType(Tab);
        const tab = tabs?.find((tab) => tab.endpoint.payload.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === 'MUSIC_PAGE_TYPE_TRACK_RELATED');
        if (!tab)
            throw new InnertubeError('Could not find target tab.');
        const page = await tab.endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC', parse: true });
        if (!page.contents)
            throw new InnertubeError('Unexpected response', page);
        return page.contents.item().as(SectionList, Message);
    }
    async getLyrics(video_id) {
        throwIfMissing({ video_id });
        const watch_next_endpoint = new NavigationEndpoint({ watchNextEndpoint: { videoId: video_id } });
        const response = await watch_next_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC', parse: true });
        const tabs = response.contents_memo?.getType(Tab);
        const tab = tabs?.find((tab) => tab.endpoint.payload.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === 'MUSIC_PAGE_TYPE_TRACK_LYRICS');
        if (!tab)
            throw new InnertubeError('Could not find target tab.');
        const page = await tab.endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC', parse: true });
        if (!page.contents)
            throw new InnertubeError('Unexpected response', page);
        if (page.contents.item().type === 'Message')
            throw new InnertubeError(page.contents.item().as(Message).text.toString(), video_id);
        const section_list = page.contents.item().as(SectionList).contents;
        return section_list.firstOfType(MusicDescriptionShelf);
    }
    async getRecap() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEmusic_listening_review' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC' });
        return new Recap(response, __classPrivateFieldGet(this, _Music_actions, "f"));
    }
    async getSearchSuggestions(input) {
        const response = await __classPrivateFieldGet(this, _Music_actions, "f").execute('/music/get_search_suggestions', {
            input,
            client: 'YTMUSIC',
            parse: true
        });
        if (!response.contents_memo)
            return [];
        return response.contents_memo.getType(SearchSuggestionsSection);
    }
}
_Music_session = new WeakMap(), _Music_actions = new WeakMap(), _Music_instances = new WeakSet(), _Music_fetchInfoFromVideoId = async function _Music_fetchInfoFromVideoId(video_id) {
    const payload = { videoId: video_id, racyCheckOk: true, contentCheckOk: true };
    const watch_endpoint = new NavigationEndpoint({ watchEndpoint: payload });
    const watch_next_endpoint = new NavigationEndpoint({ watchNextEndpoint: payload });
    const extra_payload = {
        playbackContext: {
            contentPlaybackContext: {
                vis: 0,
                splay: false,
                lactMilliseconds: '-1',
                signatureTimestamp: __classPrivateFieldGet(this, _Music_session, "f").player?.sts
            }
        },
        client: 'YTMUSIC'
    };
    if (__classPrivateFieldGet(this, _Music_session, "f").po_token) {
        extra_payload.serviceIntegrityDimensions = {
            poToken: __classPrivateFieldGet(this, _Music_session, "f").po_token
        };
    }
    const watch_response = watch_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), extra_payload);
    const watch_next_response = watch_next_endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), { client: 'YTMUSIC' });
    const response = await Promise.all([watch_response, watch_next_response]);
    const cpn = generateRandomString(16);
    return new TrackInfo(response, __classPrivateFieldGet(this, _Music_actions, "f"), cpn);
}, _Music_fetchInfoFromEndpoint = async function _Music_fetchInfoFromEndpoint(endpoint) {
    if (!endpoint)
        throw new Error('This item does not have an endpoint.');
    const extra_payload = {
        playbackContext: {
            contentPlaybackContext: {
                vis: 0,
                splay: false,
                lactMilliseconds: '-1',
                signatureTimestamp: __classPrivateFieldGet(this, _Music_session, "f").player?.sts
            }
        },
        client: 'YTMUSIC'
    };
    if (__classPrivateFieldGet(this, _Music_session, "f").po_token) {
        extra_payload.serviceIntegrityDimensions = {
            poToken: __classPrivateFieldGet(this, _Music_session, "f").po_token
        };
    }
    const player_response = endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), extra_payload);
    const next_response = endpoint.call(__classPrivateFieldGet(this, _Music_actions, "f"), {
        client: 'YTMUSIC',
        enablePersistentPlaylistPanel: true,
        override_endpoint: '/next'
    });
    const cpn = generateRandomString(16);
    const response = await Promise.all([player_response, next_response]);
    return new TrackInfo(response, __classPrivateFieldGet(this, _Music_actions, "f"), cpn);
};
export default Music;
//# sourceMappingURL=Music.js.map