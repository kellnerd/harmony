import Feed from '../../core/mixins/Feed.js';
import KidsCategoriesHeader from '../classes/ytkids/KidsCategoriesHeader.js';
import KidsCategoryTab from '../classes/ytkids/KidsCategoryTab.js';
import KidsHomeScreen from '../classes/ytkids/KidsHomeScreen.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type { IBrowseResponse } from '../types/index.js';
export default class HomeFeed extends Feed<IBrowseResponse> {
    header?: KidsCategoriesHeader;
    contents?: KidsHomeScreen;
    constructor(actions: Actions, data: ApiResponse | IBrowseResponse, already_parsed?: boolean);
    /**
     * Retrieves the contents of the given category tab. Use {@link HomeFeed.categories} to get a list of available categories.
     * @param tab - The tab to select
     */
    selectCategoryTab(tab: string | KidsCategoryTab): Promise<HomeFeed>;
    get categories(): string[];
}
