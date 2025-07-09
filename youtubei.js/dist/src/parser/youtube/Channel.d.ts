import Feed from '../../core/mixins/Feed.js';
import FilterableFeed from '../../core/mixins/FilterableFeed.js';
import TabbedFeed from '../../core/mixins/TabbedFeed.js';
import C4TabbedHeader from '../classes/C4TabbedHeader.js';
import CarouselHeader from '../classes/CarouselHeader.js';
import ChannelAboutFullMetadata from '../classes/ChannelAboutFullMetadata.js';
import AboutChannel from '../classes/AboutChannel.js';
import InteractiveTabbedHeader from '../classes/InteractiveTabbedHeader.js';
import SubscribeButton from '../classes/SubscribeButton.js';
import ExpandableTab from '../classes/ExpandableTab.js';
import type Tab from '../classes/Tab.js';
import PageHeader from '../classes/PageHeader.js';
import ChipCloudChip from '../classes/ChipCloudChip.js';
import type { AppendContinuationItemsAction, NavigateAction, ReloadContinuationItemsCommand, ShowMiniplayerCommand } from '../index.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type { IBrowseResponse } from '../types/index.js';
import type OpenPopupAction from '../classes/actions/OpenPopupAction.js';
export default class Channel extends TabbedFeed<IBrowseResponse> {
    header?: C4TabbedHeader | CarouselHeader | InteractiveTabbedHeader | PageHeader;
    metadata: {
        url_canonical?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        thumbnail?: import("../misc.js").Thumbnail[] | undefined;
        site_name?: string | undefined;
        app_name?: string | undefined;
        android_package?: string | undefined;
        ios_app_store_id?: string | undefined;
        ios_app_arguments?: string | undefined;
        og_type?: string | undefined;
        url_applinks_web?: string | undefined;
        url_applinks_ios?: string | undefined;
        url_applinks_android?: string | undefined;
        url_twitter_ios?: string | undefined;
        url_twitter_android?: string | undefined;
        twitter_card_type?: string | undefined;
        twitter_site_handle?: string | undefined;
        schema_dot_org_type?: string | undefined;
        noindex?: string | undefined;
        is_unlisted?: boolean | undefined;
        is_family_safe?: boolean | undefined;
        tags?: string[] | undefined;
        available_countries?: string[] | undefined;
        type?: string | undefined;
        url?: string | undefined;
        rss_url?: string | undefined;
        vanity_channel_url?: string | undefined;
        external_id?: string | undefined;
        keywords?: string[] | undefined;
        avatar?: import("../misc.js").Thumbnail[] | undefined;
        music_artist_name?: string | undefined;
        android_deep_link?: string | undefined;
        android_appindexing_link?: string | undefined;
        ios_appindexing_link?: string | undefined;
    };
    subscribe_button?: SubscribeButton;
    current_tab?: Tab | ExpandableTab;
    constructor(actions: Actions, data: ApiResponse | IBrowseResponse, already_parsed?: boolean);
    /**
     * Applies given filter to the list. Use {@link filters} to get available filters.
     * @param filter - The filter to apply
     */
    applyFilter(filter: string | ChipCloudChip): Promise<FilteredChannelList>;
    /**
     * Applies given sort filter to the list. Use {@link sort_filters} to get available filters.
     * @param sort - The sort filter to apply
     */
    applySort(sort: string): Promise<Channel>;
    /**
     * Applies given content type filter to the list. Use {@link content_type_filters} to get available filters.
     * @param content_type_filter - The content type filter to apply
     */
    applyContentTypeFilter(content_type_filter: string): Promise<Channel>;
    get filters(): string[];
    get sort_filters(): string[];
    get content_type_filters(): string[];
    getHome(): Promise<Channel>;
    getVideos(): Promise<Channel>;
    getShorts(): Promise<Channel>;
    getLiveStreams(): Promise<Channel>;
    getReleases(): Promise<Channel>;
    getPodcasts(): Promise<Channel>;
    getCourses(): Promise<Channel>;
    getPlaylists(): Promise<Channel>;
    getCommunity(): Promise<Channel>;
    /**
     * Retrieves the about page.
     * Note that this does not return a new {@link Channel} object.
     */
    getAbout(): Promise<ChannelAboutFullMetadata | AboutChannel>;
    /**
     * Searches within the channel.
     */
    search(query: string): Promise<Channel>;
    get has_home(): boolean;
    get has_videos(): boolean;
    get has_shorts(): boolean;
    get has_live_streams(): boolean;
    get has_releases(): boolean;
    get has_podcasts(): boolean;
    get has_courses(): boolean;
    get has_playlists(): boolean;
    get has_community(): boolean;
    get has_about(): boolean;
    get has_search(): boolean;
    getContinuation(): Promise<ChannelListContinuation>;
}
export declare class ChannelListContinuation extends Feed<IBrowseResponse> {
    contents?: AppendContinuationItemsAction | OpenPopupAction | NavigateAction | ShowMiniplayerCommand | ReloadContinuationItemsCommand;
    constructor(actions: Actions, data: ApiResponse | IBrowseResponse, already_parsed?: boolean);
    getContinuation(): Promise<ChannelListContinuation>;
}
export declare class FilteredChannelList extends FilterableFeed<IBrowseResponse> {
    applied_filter?: ChipCloudChip;
    contents?: AppendContinuationItemsAction | OpenPopupAction | NavigateAction | ShowMiniplayerCommand | ReloadContinuationItemsCommand;
    constructor(actions: Actions, data: ApiResponse | IBrowseResponse, already_parsed?: boolean);
    /**
     * Applies given filter to the list.
     * @param filter - The filter to apply
     */
    applyFilter(filter: string | ChipCloudChip): Promise<FilteredChannelList>;
    getContinuation(): Promise<FilteredChannelList>;
}
