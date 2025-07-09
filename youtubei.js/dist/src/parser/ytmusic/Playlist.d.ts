import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicDetailHeader from '../classes/MusicDetailHeader.js';
import MusicEditablePlaylistDetailHeader from '../classes/MusicEditablePlaylistDetailHeader.js';
import MusicResponsiveListItem from '../classes/MusicResponsiveListItem.js';
import MusicResponsiveHeader from '../classes/MusicResponsiveHeader.js';
import { type ObservedArray } from '../helpers.js';
import type { Actions, ApiResponse } from '../../core/index.js';
import type { IBrowseResponse } from '../types/index.js';
import type MusicThumbnail from '../classes/MusicThumbnail.js';
import ContinuationItem from '../classes/ContinuationItem.js';
export default class Playlist {
    #private;
    header?: MusicResponsiveHeader | MusicDetailHeader | MusicEditablePlaylistDetailHeader;
    contents?: ObservedArray<MusicResponsiveListItem | ContinuationItem>;
    background?: MusicThumbnail;
    constructor(response: ApiResponse, actions: Actions);
    /**
     * Retrieves playlist items continuation.
     */
    getContinuation(): Promise<Playlist>;
    /**
     * Retrieves related playlists
     */
    getRelated(): Promise<MusicCarouselShelf>;
    getSuggestions(refresh?: boolean): Promise<ObservedArray<MusicResponsiveListItem>>;
    get page(): IBrowseResponse;
    get items(): ObservedArray<MusicResponsiveListItem | ContinuationItem>;
    get has_continuation(): boolean;
}
