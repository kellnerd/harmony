import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import SectionList from './SectionList.js';
import BrowseFeedActions from './BrowseFeedActions.js';
import ProfileColumn from './ProfileColumn.js';
import Tab from './Tab.js';
import ExpandableTab from './ExpandableTab.js';
export default class TwoColumnBrowseResults extends YTNode {
    static type: string;
    tabs: ObservedArray<Tab | ExpandableTab>;
    secondary_contents: SectionList | BrowseFeedActions | ProfileColumn | null;
    constructor(data: RawNode);
}
