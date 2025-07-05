import Session from './core/Session.js';
import { Kids, Music, Studio } from './core/clients/index.js';
import { AccountManager, InteractionManager, PlaylistManager } from './core/managers/index.js';
import { Feed, TabbedFeed } from './core/mixins/index.js';
import { Channel, Comments, Guide, HashtagFeed, History, HomeFeed, Library, NotificationsMenu, Playlist, Search, VideoInfo } from './parser/youtube/index.js';
import { ShortFormVideoInfo } from './parser/ytshorts/index.js';
import NavigationEndpoint from './parser/classes/NavigationEndpoint.js';
import type { ApiResponse } from './core/Actions.js';
import type { DownloadOptions, EngagementType, FormatOptions, InnerTubeClient, InnerTubeConfig, SearchFilters } from './types/index.js';
import type { IBrowseResponse, IParsedResponse } from './parser/index.js';
import type Format from './parser/classes/misc/Format.js';
/**
 * Provides access to various services and modules in the YouTube API.
 *
 * @example
 * ```ts
 * import { Innertube, UniversalCache } from 'youtubei.js';
 * const innertube = await Innertube.create({ cache: new UniversalCache(true)});
 * ```
 */
export default class Innertube {
    #private;
    constructor(session: Session);
    static create(config?: InnerTubeConfig): Promise<Innertube>;
    getInfo(target: string | NavigationEndpoint, client?: InnerTubeClient): Promise<VideoInfo>;
    getBasicInfo(video_id: string, client?: InnerTubeClient): Promise<VideoInfo>;
    getShortsVideoInfo(video_id: string, client?: InnerTubeClient): Promise<ShortFormVideoInfo>;
    search(query: string, filters?: SearchFilters): Promise<Search>;
    getSearchSuggestions(query: string, previous_query?: string): Promise<string[]>;
    getComments(video_id: string, sort_by?: 'TOP_COMMENTS' | 'NEWEST_FIRST', comment_id?: string): Promise<Comments>;
    getHomeFeed(): Promise<HomeFeed>;
    getGuide(): Promise<Guide>;
    getLibrary(): Promise<Library>;
    getHistory(): Promise<History>;
    getTrending(): Promise<TabbedFeed<IBrowseResponse>>;
    getCourses(): Promise<Feed<IBrowseResponse>>;
    getSubscriptionsFeed(): Promise<Feed<IBrowseResponse>>;
    getChannelsFeed(): Promise<Feed<IBrowseResponse>>;
    getChannel(id: string): Promise<Channel>;
    getNotifications(): Promise<NotificationsMenu>;
    getUnseenNotificationsCount(): Promise<number>;
    /**
     * Retrieves the user's playlists.
     */
    getPlaylists(): Promise<Feed<IBrowseResponse>>;
    getPlaylist(id: string): Promise<Playlist>;
    getHashtag(hashtag: string): Promise<HashtagFeed>;
    /**
     * An alternative to {@link download}.
     * Returns deciphered streaming data.
     *
     * If you wish to retrieve the video info too, have a look at {@link getBasicInfo} or {@link getInfo}.
     * @param video_id - The video id.
     * @param options - Format options.
     */
    getStreamingData(video_id: string, options?: FormatOptions): Promise<Format>;
    /**
     * Downloads a given video. If all you need the direct download link, see {@link getStreamingData}.
     * If you wish to retrieve the video info too, have a look at {@link getBasicInfo} or {@link getInfo}.
     * @param video_id - The video id.
     * @param options - Download options.
     */
    download(video_id: string, options?: DownloadOptions): Promise<ReadableStream<Uint8Array>>;
    /**
     * Resolves the given URL.
     */
    resolveURL(url: string): Promise<NavigationEndpoint>;
    /**
     * Gets a post page given a post id and the channel id
     */
    getPost(post_id: string, channel_id: string): Promise<Feed<IBrowseResponse>>;
    /**
     * Gets the comments of a post.
     */
    getPostComments(post_id: string, channel_id: string, sort_by?: 'TOP_COMMENTS' | 'NEWEST_FIRST'): Promise<Comments>;
    /**
     * Fetches an attestation challenge.
     */
    getAttestationChallenge(engagement_type: EngagementType, ids?: Record<string, any>[]): Promise<import("./parser/index.js").IGetChallengeResponse>;
    /**
     * Utility method to call an endpoint without having to use {@link Actions}.
     */
    call<T extends IParsedResponse>(endpoint: NavigationEndpoint, args: {
        [key: string]: any;
        parse: true;
    }): Promise<T>;
    call(endpoint: NavigationEndpoint, args?: {
        [key: string]: any;
        parse?: false;
    }): Promise<ApiResponse>;
    /**
     * An interface for interacting with YouTube Music.
     */
    get music(): Music;
    /**
     * An interface for interacting with YouTube Studio.
     */
    get studio(): Studio;
    /**
     * An interface for interacting with YouTube Kids.
     */
    get kids(): Kids;
    /**
     * An interface for managing and retrieving account information.
     */
    get account(): AccountManager;
    /**
     * An interface for managing playlists.
     */
    get playlist(): PlaylistManager;
    /**
     * An interface for directly interacting with certain YouTube features.
     */
    get interact(): InteractionManager;
    /**
     * An internal class used to dispatch requests.
     */
    get actions(): import("./core/Actions.js").default;
    /**
     * The session used by this instance.
     */
    get session(): Session;
}
