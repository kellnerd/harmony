import FilterableFeed from '../../core/mixins/FilterableFeed.js';
import HashtagHeader from '../classes/HashtagHeader.js';
import RichGrid from '../classes/RichGrid.js';
import PageHeader from '../classes/PageHeader.js';
import type { Actions, ApiResponse } from '../../core/index.js';
import type { IBrowseResponse } from '../index.js';
import type ChipCloudChip from '../classes/ChipCloudChip.js';
export default class HashtagFeed extends FilterableFeed<IBrowseResponse> {
    header?: HashtagHeader | PageHeader;
    contents: RichGrid;
    constructor(actions: Actions, response: IBrowseResponse | ApiResponse);
    /**
     * Applies given filter and returns a new {@link HashtagFeed} object. Use {@link HashtagFeed.filters} to get available filters.
     * @param filter - Filter to apply.
     */
    applyFilter(filter: string | ChipCloudChip): Promise<HashtagFeed>;
}
