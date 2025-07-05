import { Album, Artist, Explore, HomeFeed, Library, Playlist, Recap, Search, TrackInfo } from '../../parser/ytmusic/index.js';
import Message from '../../parser/classes/Message.js';
import MusicDescriptionShelf from '../../parser/classes/MusicDescriptionShelf.js';
import MusicTwoRowItem from '../../parser/classes/MusicTwoRowItem.js';
import MusicResponsiveListItem from '../../parser/classes/MusicResponsiveListItem.js';
import NavigationEndpoint from '../../parser/classes/NavigationEndpoint.js';
import PlaylistPanel from '../../parser/classes/PlaylistPanel.js';
import SearchSuggestionsSection from '../../parser/classes/SearchSuggestionsSection.js';
import SectionList from '../../parser/classes/SectionList.js';
import type { ObservedArray } from '../../parser/helpers.js';
import type { MusicSearchFilters } from '../../types/index.js';
import type { Session } from '../index.js';
export default class Music {
    #private;
    constructor(session: Session);
    /**
     * Retrieves track info. Passing a list item of type MusicTwoRowItem automatically starts a radio.
     * @param target - Video id or a list item.
     */
    getInfo(target: string | MusicTwoRowItem | MusicResponsiveListItem | NavigationEndpoint): Promise<TrackInfo>;
    search(query: string, filters?: MusicSearchFilters): Promise<Search>;
    getHomeFeed(): Promise<HomeFeed>;
    getExplore(): Promise<Explore>;
    getLibrary(): Promise<Library>;
    getArtist(artist_id: string): Promise<Artist>;
    getAlbum(album_id: string): Promise<Album>;
    getPlaylist(playlist_id: string): Promise<Playlist>;
    getUpNext(video_id: string, automix?: boolean): Promise<PlaylistPanel>;
    getRelated(video_id: string): Promise<SectionList | Message>;
    getLyrics(video_id: string): Promise<MusicDescriptionShelf | undefined>;
    getRecap(): Promise<Recap>;
    getSearchSuggestions(input: string): Promise<ObservedArray<SearchSuggestionsSection>>;
}
