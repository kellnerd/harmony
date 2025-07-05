import Feed from '../../core/mixins/Feed.js';
import HorizontalCardList from '../classes/HorizontalCardList.js';
import SearchHeader from '../classes/SearchHeader.js';
import SearchRefinementCard from '../classes/SearchRefinementCard.js';
import SearchSubMenu from '../classes/SearchSubMenu.js';
import UniversalWatchCard from '../classes/UniversalWatchCard.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type { ObservedArray, YTNode } from '../helpers.js';
import type { ISearchResponse } from '../types/index.js';
export default class Search extends Feed<ISearchResponse> {
    header?: SearchHeader;
    results: ObservedArray<YTNode>;
    refinements: string[];
    estimated_results: number;
    sub_menu?: SearchSubMenu;
    watch_card?: UniversalWatchCard;
    refinement_cards?: HorizontalCardList | null;
    constructor(actions: Actions, data: ApiResponse | ISearchResponse, already_parsed?: boolean);
    /**
     * Applies given refinement card and returns a new {@link Search} object. Use {@link refinement_card_queries} to get a list of available refinement cards.
     */
    selectRefinementCard(card: SearchRefinementCard | string): Promise<Search>;
    /**
     * Returns a list of refinement card queries.
     */
    get refinement_card_queries(): string[];
    /**
     * Retrieves next batch of search results.
     */
    getContinuation(): Promise<Search>;
}
