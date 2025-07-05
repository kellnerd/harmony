import { MediaInfo } from '../../core/mixins/index.js';
import Tab from '../classes/Tab.js';
import Message from '../classes/Message.js';
import MusicDescriptionShelf from '../classes/MusicDescriptionShelf.js';
import PlayerOverlay from '../classes/PlayerOverlay.js';
import PlaylistPanel from '../classes/PlaylistPanel.js';
import SectionList from '../classes/SectionList.js';
import type RichGrid from '../classes/RichGrid.js';
import type MusicQueue from '../classes/MusicQueue.js';
import type MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import NavigationEndpoint from '../classes/NavigationEndpoint.js';
import type { ObservedArray, YTNode } from '../helpers.js';
import type { Actions, ApiResponse } from '../../core/index.js';
import { PlaylistPanelContinuation } from '../continuations.js';
declare class TrackInfo extends MediaInfo {
    tabs?: ObservedArray<Tab>;
    current_video_endpoint?: NavigationEndpoint;
    player_overlays?: PlayerOverlay;
    constructor(data: [ApiResponse, ApiResponse?], actions: Actions, cpn: string);
    /**
     * Retrieves contents of the given tab.
     */
    getTab(title_or_page_type: string): Promise<ObservedArray<YTNode> | SectionList | MusicQueue | RichGrid | Message>;
    /**
     * Retrieves up next.
     */
    getUpNext(automix?: boolean): Promise<PlaylistPanel>;
    /**
     * Retrieves up next continuation relative to current TrackInfo.
     */
    getUpNextContinuation(playlistPanel: PlaylistPanel | PlaylistPanelContinuation): Promise<PlaylistPanelContinuation>;
    /**
     * Retrieves related content.
     */
    getRelated(): Promise<ObservedArray<MusicCarouselShelf | MusicDescriptionShelf>>;
    /**
     * Retrieves lyrics.
     */
    getLyrics(): Promise<MusicDescriptionShelf | undefined>;
    /**
     * Adds the song to the watch history.
     */
    addToWatchHistory(): Promise<Response>;
    /**
     * Updates the watch time of the song.
     */
    updateWatchTime(startTime: number): Promise<Response>;
    get available_tabs(): string[];
}
export default TrackInfo;
