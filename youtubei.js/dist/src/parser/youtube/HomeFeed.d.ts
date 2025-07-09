import FilterableFeed from '../../core/mixins/FilterableFeed.js';
import FeedTabbedHeader from '../classes/FeedTabbedHeader.js';
import RichGrid from '../classes/RichGrid.js';
import type { IBrowseResponse } from '../types/index.js';
import type { AppendContinuationItemsAction, ReloadContinuationItemsCommand } from '../index.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type ChipCloudChip from '../classes/ChipCloudChip.js';
export default class HomeFeed extends FilterableFeed<IBrowseResponse> {
    contents?: RichGrid | AppendContinuationItemsAction | ReloadContinuationItemsCommand;
    header?: FeedTabbedHeader;
    constructor(actions: Actions, data: ApiResponse | IBrowseResponse, already_parsed?: boolean);
    /**
     * Applies given filter to the feed. Use {@link filters} to get available filters.
     * @param filter - Filter to apply.
     */
    applyFilter(filter: string | ChipCloudChip): Promise<HomeFeed>;
    /**
     * Retrieves next batch of contents.
     */
    getContinuation(): Promise<HomeFeed>;
}
