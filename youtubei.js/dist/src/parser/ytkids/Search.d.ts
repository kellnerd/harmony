import Feed from '../../core/mixins/Feed.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type { ObservedArray, YTNode } from '../helpers.js';
import type { ISearchResponse } from '../types/index.js';
export default class Search extends Feed<ISearchResponse> {
    estimated_results?: number;
    contents: ObservedArray<YTNode> | null;
    constructor(actions: Actions, data: ApiResponse | ISearchResponse);
}
