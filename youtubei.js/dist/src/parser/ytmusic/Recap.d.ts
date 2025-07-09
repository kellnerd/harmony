import Playlist from './Playlist.js';
import HighlightsCarousel from '../classes/HighlightsCarousel.js';
import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicHeader from '../classes/MusicHeader.js';
import ItemSection from '../classes/ItemSection.js';
import Message from '../classes/Message.js';
import type { ObservedArray } from '../helpers.js';
import type { IBrowseResponse } from '../types/index.js';
import type { ApiResponse, Actions } from '../../core/index.js';
export default class Recap {
    #private;
    header?: HighlightsCarousel | MusicHeader;
    sections?: ObservedArray<ItemSection | MusicCarouselShelf | Message>;
    constructor(response: ApiResponse, actions: Actions);
    /**
     * Retrieves recap playlist.
     */
    getPlaylist(): Promise<Playlist>;
    get page(): IBrowseResponse;
}
