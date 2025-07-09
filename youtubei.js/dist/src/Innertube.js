var _Innertube_session;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import Session from './core/Session.js';
import { Kids, Music, Studio } from './core/clients/index.js';
import { AccountManager, InteractionManager, PlaylistManager } from './core/managers/index.js';
import { Feed, TabbedFeed } from './core/mixins/index.js';
import { Channel, Comments, Guide, HashtagFeed, History, HomeFeed, Library, NotificationsMenu, Playlist, Search, VideoInfo } from './parser/youtube/index.js';
import { ShortFormVideoInfo } from './parser/ytshorts/index.js';
import NavigationEndpoint from './parser/classes/NavigationEndpoint.js';
import * as Constants from './utils/Constants.js';
import { generateRandomString, InnertubeError, throwIfMissing, u8ToBase64 } from './utils/Utils.js';
import { CommunityPostCommentsParam, CommunityPostCommentsParamContainer, CommunityPostParams, GetCommentsSectionParams, Hashtag, ReelSequence, SearchFilter, SearchFilter_Filters_Duration, SearchFilter_Filters_SearchType, SearchFilter_Filters_UploadDate, SearchFilter_SortBy } from '../protos/generated/misc/params.js';
/**
 * Provides access to various services and modules in the YouTube API.
 *
 * @example
 * ```ts
 * import { Innertube, UniversalCache } from 'youtubei.js';
 * const innertube = await Innertube.create({ cache: new UniversalCache(true)});
 * ```
 */
class Innertube {
    constructor(session) {
        _Innertube_session.set(this, void 0);
        __classPrivateFieldSet(this, _Innertube_session, session, "f");
    }
    static async create(config = {}) {
        return new Innertube(await Session.create(config));
    }
    async getInfo(target, client) {
        throwIfMissing({ target });
        const payload = {
            videoId: target instanceof NavigationEndpoint ? target.payload?.videoId : target,
            playlistId: target instanceof NavigationEndpoint ? target.payload?.playlistId : undefined,
            playlistIndex: target instanceof NavigationEndpoint ? target.payload?.playlistIndex : undefined,
            params: target instanceof NavigationEndpoint ? target.payload?.params : undefined,
            racyCheckOk: true,
            contentCheckOk: true
        };
        const watch_endpoint = new NavigationEndpoint({ watchEndpoint: payload });
        const watch_next_endpoint = new NavigationEndpoint({ watchNextEndpoint: payload });
        const session = __classPrivateFieldGet(this, _Innertube_session, "f");
        const extra_payload = {
            playbackContext: {
                contentPlaybackContext: {
                    vis: 0,
                    splay: false,
                    lactMilliseconds: '-1',
                    signatureTimestamp: session.player?.sts
                }
            },
            client
        };
        if (session.po_token) {
            extra_payload.serviceIntegrityDimensions = {
                poToken: session.po_token
            };
        }
        const watch_response = watch_endpoint.call(session.actions, extra_payload);
        const watch_next_response = watch_next_endpoint.call(session.actions);
        const response = await Promise.all([watch_response, watch_next_response]);
        const cpn = generateRandomString(16);
        return new VideoInfo(response, session.actions, cpn);
    }
    async getBasicInfo(video_id, client) {
        throwIfMissing({ video_id });
        const watch_endpoint = new NavigationEndpoint({
            watchEndpoint: {
                videoId: video_id,
                racyCheckOk: true,
                contentCheckOk: true
            }
        });
        const session = __classPrivateFieldGet(this, _Innertube_session, "f");
        const extra_payload = {
            playbackContext: {
                contentPlaybackContext: {
                    vis: 0,
                    splay: false,
                    lactMilliseconds: '-1',
                    signatureTimestamp: session.player?.sts
                }
            },
            client
        };
        if (session.po_token) {
            extra_payload.serviceIntegrityDimensions = {
                poToken: session.po_token
            };
        }
        const watch_response = await watch_endpoint.call(session.actions, extra_payload);
        const cpn = generateRandomString(16);
        return new VideoInfo([watch_response], session.actions, cpn);
    }
    async getShortsVideoInfo(video_id, client) {
        throwIfMissing({ video_id });
        const reel_watch_endpoint = new NavigationEndpoint({
            reelWatchEndpoint: {
                disablePlayerResponse: false,
                params: 'CAUwAg%3D%3D',
                videoId: video_id
            }
        });
        const actions = __classPrivateFieldGet(this, _Innertube_session, "f").actions;
        const reel_watch_response = reel_watch_endpoint.call(actions, { client });
        const writer = ReelSequence.encode({
            shortId: video_id,
            params: {
                number: 5
            },
            feature2: 25,
            feature3: 0
        });
        const params = encodeURIComponent(u8ToBase64(writer.finish()));
        const sequence_response = actions.execute('/reel/reel_watch_sequence', { sequenceParams: params });
        const response = await Promise.all([reel_watch_response, sequence_response]);
        const cpn = generateRandomString(16);
        return new ShortFormVideoInfo([response[0]], actions, cpn, response[1]);
    }
    async search(query, filters = {}) {
        throwIfMissing({ query });
        const search_filter = {};
        search_filter.filters = {};
        if (filters.sort_by) {
            search_filter.sortBy = SearchFilter_SortBy[filters.sort_by.toUpperCase()];
        }
        if (filters.upload_date) {
            search_filter.filters.uploadDate = SearchFilter_Filters_UploadDate[filters.upload_date.toUpperCase()];
        }
        if (filters.type) {
            search_filter.filters.type = SearchFilter_Filters_SearchType[filters.type.toUpperCase()];
        }
        if (filters.duration) {
            search_filter.filters.duration = SearchFilter_Filters_Duration[filters.duration.toUpperCase()];
        }
        if (filters.features) {
            for (const feature of filters.features) {
                switch (feature) {
                    case '360':
                        search_filter.filters.features360 = true;
                        break;
                    case '3d':
                        search_filter.filters.features3d = true;
                        break;
                    case '4k':
                        search_filter.filters.features4k = true;
                        break;
                    case 'creative_commons':
                        search_filter.filters.featuresCreativeCommons = true;
                        break;
                    case 'hd':
                        search_filter.filters.featuresHd = true;
                        break;
                    case 'hdr':
                        search_filter.filters.featuresHdr = true;
                        break;
                    case 'live':
                        search_filter.filters.featuresLive = true;
                        break;
                    case 'location':
                        search_filter.filters.featuresLocation = true;
                        break;
                    case 'purchased':
                        search_filter.filters.featuresPurchased = true;
                        break;
                    case 'subtitles':
                        search_filter.filters.featuresSubtitles = true;
                        break;
                    case 'vr180':
                        search_filter.filters.featuresVr180 = true;
                        break;
                    default:
                        break;
                }
            }
        }
        const search_endpoint = new NavigationEndpoint({
            searchEndpoint: {
                query,
                params: filters ? encodeURIComponent(u8ToBase64(SearchFilter.encode(search_filter).finish())) : undefined
            }
        });
        const response = await search_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new Search(this.actions, response);
    }
    async getSearchSuggestions(query, previous_query) {
        const session = __classPrivateFieldGet(this, _Innertube_session, "f");
        const url = new URL(`${Constants.URLS.YT_SUGGESTIONS}/complete/search`);
        url.searchParams.set('client', 'youtube');
        url.searchParams.set('gs_ri', 'youtube');
        url.searchParams.set('gs_id', '0');
        url.searchParams.set('cp', '0');
        url.searchParams.set('ds', 'yt');
        url.searchParams.set('sugexp', Constants.CLIENTS.WEB.SUGG_EXP_ID);
        url.searchParams.set('hl', session.context.client.hl);
        url.searchParams.set('gl', session.context.client.gl);
        url.searchParams.set('q', query);
        if (previous_query)
            url.searchParams.set('pq', previous_query);
        const response = await session.http.fetch_function(url, {
            headers: {
                'Cookie': session.cookie || ''
            }
        });
        const text = await response.text();
        const data = JSON.parse(text.replace('window.google.ac.h(', '').slice(0, -1));
        return data[1].map((suggestion) => suggestion[0]);
    }
    async getComments(video_id, sort_by, comment_id) {
        throwIfMissing({ video_id });
        const SORT_OPTIONS = {
            TOP_COMMENTS: 0,
            NEWEST_FIRST: 1
        };
        const token = GetCommentsSectionParams.encode({
            ctx: {
                videoId: video_id
            },
            unkParam: 6,
            params: {
                opts: {
                    videoId: video_id,
                    sortBy: SORT_OPTIONS[sort_by || 'TOP_COMMENTS'],
                    type: 2,
                    commentId: comment_id || ''
                },
                target: 'comments-section'
            }
        });
        const continuation = encodeURIComponent(u8ToBase64(token.finish()));
        const continuation_command = new NavigationEndpoint({
            continuationCommand: {
                request: 'CONTINUATION_REQUEST_TYPE_WATCH_NEXT',
                token: continuation
            }
        });
        const response = await continuation_command.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new Comments(this.actions, response.data);
    }
    async getHomeFeed() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEwhat_to_watch' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new HomeFeed(this.actions, response);
    }
    async getGuide() {
        const response = await this.actions.execute('/guide');
        return new Guide(response.data);
    }
    async getLibrary() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FElibrary' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new Library(this.actions, response);
    }
    async getHistory() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEhistory' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new History(this.actions, response);
    }
    async getTrending() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEtrending' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new TabbedFeed(this.actions, response);
    }
    async getCourses() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEcourses_destination' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions, { parse: true });
        return new Feed(this.actions, response);
    }
    async getSubscriptionsFeed() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEsubscriptions' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions, { parse: true });
        return new Feed(this.actions, response);
    }
    async getChannelsFeed() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEchannels' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions, { parse: true });
        return new Feed(this.actions, response);
    }
    async getChannel(id) {
        throwIfMissing({ id });
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: id } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new Channel(this.actions, response);
    }
    async getNotifications() {
        const response = await this.actions.execute('/notification/get_notification_menu', { notificationsMenuRequestType: 'NOTIFICATIONS_MENU_REQUEST_TYPE_INBOX' });
        return new NotificationsMenu(this.actions, response);
    }
    async getUnseenNotificationsCount() {
        const response = await this.actions.execute('/notification/get_unseen_count');
        // FIXME: properly parse this.
        return response.data?.unseenCount || response.data?.actions?.[0].updateNotificationsUnseenCountAction?.unseenCount || 0;
    }
    /**
     * Retrieves the user's playlists.
     */
    async getPlaylists() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEplaylist_aggregation' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions, { parse: true });
        return new Feed(this.actions, response);
    }
    async getPlaylist(id) {
        throwIfMissing({ id });
        if (!id.startsWith('VL')) {
            id = `VL${id}`;
        }
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: id } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new Playlist(this.actions, response);
    }
    async getHashtag(hashtag) {
        throwIfMissing({ hashtag });
        const writer = Hashtag.encode({
            params: {
                hashtag,
                type: 1
            }
        });
        const params = encodeURIComponent(u8ToBase64(writer.finish()));
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'FEhashtag', params } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new HashtagFeed(this.actions, response);
    }
    /**
     * An alternative to {@link download}.
     * Returns deciphered streaming data.
     *
     * If you wish to retrieve the video info too, have a look at {@link getBasicInfo} or {@link getInfo}.
     * @param video_id - The video id.
     * @param options - Format options.
     */
    async getStreamingData(video_id, options = {}) {
        const info = await this.getBasicInfo(video_id, options?.client);
        const format = info.chooseFormat(options);
        format.url = format.decipher(__classPrivateFieldGet(this, _Innertube_session, "f").player);
        return format;
    }
    /**
     * Downloads a given video. If all you need the direct download link, see {@link getStreamingData}.
     * If you wish to retrieve the video info too, have a look at {@link getBasicInfo} or {@link getInfo}.
     * @param video_id - The video id.
     * @param options - Download options.
     */
    async download(video_id, options) {
        const info = await this.getBasicInfo(video_id, options?.client);
        return info.download(options);
    }
    /**
     * Resolves the given URL.
     */
    async resolveURL(url) {
        const response = await this.actions.execute('/navigation/resolve_url', { url, parse: true });
        if (!response.endpoint)
            throw new InnertubeError('Failed to resolve URL. Expected a NavigationEndpoint but got undefined', response);
        return response.endpoint;
    }
    /**
     * Gets a post page given a post id and the channel id
     */
    async getPost(post_id, channel_id) {
        throwIfMissing({ post_id, channel_id });
        const writer = CommunityPostParams.encode({
            f0: 'community',
            f1: {
                postId: post_id
            },
            f2: {
                p1: 1,
                p2: 1
            }
        });
        const params = encodeURIComponent(u8ToBase64(writer.finish()).replace(/\+/g, '-').replace(/\//g, '_'));
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: channel_id, params: params } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions, { parse: true });
        return new Feed(this.actions, response);
    }
    /**
     * Gets the comments of a post.
     */
    async getPostComments(post_id, channel_id, sort_by) {
        throwIfMissing({ post_id, channel_id });
        const SORT_OPTIONS = {
            TOP_COMMENTS: 0,
            NEWEST_FIRST: 1
        };
        const writer1 = CommunityPostCommentsParam.encode({
            title: 'community',
            postContainer: {
                postId: post_id
            },
            f0: {
                f0: 1,
                f1: 1
            },
            commentDataContainer: {
                title: 'comments-section',
                commentData: {
                    sortBy: SORT_OPTIONS[sort_by || 'TOP_COMMENTS'],
                    f0: 1,
                    channelId: channel_id,
                    postId: post_id
                }
            }
        });
        const writer2 = CommunityPostCommentsParamContainer.encode({
            f0: {
                location: 'FEcomment_post_detail_page_web_top_level',
                protoData: encodeURIComponent(u8ToBase64(writer1.finish()).replace(/\+/g, '-').replace(/\//g, '_'))
            }
        });
        const continuation = encodeURIComponent(u8ToBase64(writer2.finish()));
        const continuation_command = new NavigationEndpoint({
            continuationCommand: {
                request: 'CONTINUATION_REQUEST_TYPE_BROWSE',
                token: continuation
            }
        });
        const response = await continuation_command.call(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
        return new Comments(this.actions, response.data);
    }
    /**
     * Fetches an attestation challenge.
     */
    async getAttestationChallenge(engagement_type, ids) {
        const payload = {
            engagementType: engagement_type
        };
        if (ids)
            payload.ids = ids;
        return this.actions.execute('/att/get', { parse: true, ...payload });
    }
    call(endpoint, args) {
        return endpoint.call(this.actions, args);
    }
    /**
     * An interface for interacting with YouTube Music.
     */
    get music() {
        return new Music(__classPrivateFieldGet(this, _Innertube_session, "f"));
    }
    /**
     * An interface for interacting with YouTube Studio.
     */
    get studio() {
        return new Studio(__classPrivateFieldGet(this, _Innertube_session, "f"));
    }
    /**
     * An interface for interacting with YouTube Kids.
     */
    get kids() {
        return new Kids(__classPrivateFieldGet(this, _Innertube_session, "f"));
    }
    /**
     * An interface for managing and retrieving account information.
     */
    get account() {
        return new AccountManager(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
    }
    /**
     * An interface for managing playlists.
     */
    get playlist() {
        return new PlaylistManager(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
    }
    /**
     * An interface for directly interacting with certain YouTube features.
     */
    get interact() {
        return new InteractionManager(__classPrivateFieldGet(this, _Innertube_session, "f").actions);
    }
    /**
     * An internal class used to dispatch requests.
     */
    get actions() {
        return __classPrivateFieldGet(this, _Innertube_session, "f").actions;
    }
    /**
     * The session used by this instance.
     */
    get session() {
        return __classPrivateFieldGet(this, _Innertube_session, "f");
    }
}
_Innertube_session = new WeakMap();
export default Innertube;
//# sourceMappingURL=Innertube.js.map