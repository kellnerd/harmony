import MusicCarouselShelf from '../classes/MusicCarouselShelf.js';
import MusicTastebuilderShelf from '../classes/MusicTastebuilderShelf.js';
import ChipCloud from '../classes/ChipCloud.js';
import ChipCloudChip from '../classes/ChipCloudChip.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type { ObservedArray } from '../helpers.js';
import type { IBrowseResponse } from '../types/index.js';
export default class HomeFeed {
    #private;
    sections?: ObservedArray<MusicCarouselShelf | MusicTastebuilderShelf>;
    header?: ChipCloud;
    constructor(response: ApiResponse, actions: Actions);
    /**
     * Retrieves home feed continuation.
     */
    getContinuation(): Promise<HomeFeed>;
    applyFilter(target_filter: string | ChipCloudChip): Promise<HomeFeed>;
    get filters(): string[];
    get has_continuation(): boolean;
    get page(): IBrowseResponse;
}
