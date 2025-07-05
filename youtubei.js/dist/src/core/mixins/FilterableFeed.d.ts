import Feed from './Feed.js';
import ChipCloudChip from '../../parser/classes/ChipCloudChip.js';
import type { ObservedArray } from '../../parser/helpers.js';
import type { IParsedResponse } from '../../parser/index.js';
import type { ApiResponse, Actions } from '../index.js';
export default class FilterableFeed<T extends IParsedResponse> extends Feed<T> {
    #private;
    constructor(actions: Actions, data: ApiResponse | T, already_parsed?: boolean);
    /**
     * Returns the filter chips.
     */
    get filter_chips(): ObservedArray<ChipCloudChip>;
    /**
     * Returns available filters.
     */
    get filters(): string[];
    /**
     * Applies given filter and returns a new {@link Feed} object.
     */
    getFilteredFeed(filter: string | ChipCloudChip): Promise<Feed<T>>;
}
