import type { ObservedArray } from '../helpers.js';
import MusicShelf from '../classes/MusicShelf.js';
import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicPlaylistShelf from '../classes/MusicPlaylistShelf.js';
import MusicImmersiveHeader from '../classes/MusicImmersiveHeader.js';
import MusicVisualHeader from '../classes/MusicVisualHeader.js';
import MusicHeader from '../classes/MusicHeader.js';
import type { Actions, ApiResponse } from '../../core/index.js';
import type { IBrowseResponse } from '../types/index.js';
export default class Artist {
    #private;
    header?: MusicImmersiveHeader | MusicVisualHeader | MusicHeader;
    sections: ObservedArray<MusicCarouselShelf | MusicShelf>;
    constructor(response: ApiResponse, actions: Actions);
    getAllSongs(): Promise<MusicPlaylistShelf | undefined>;
    get page(): IBrowseResponse;
}
