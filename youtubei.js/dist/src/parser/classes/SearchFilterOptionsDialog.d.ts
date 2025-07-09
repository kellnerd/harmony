import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import SearchFilterGroup from './SearchFilterGroup.js';
import Text from './misc/Text.js';
export default class SearchFilterOptionsDialog extends YTNode {
    static type: string;
    title: Text;
    groups: ObservedArray<SearchFilterGroup>;
    constructor(data: RawNode);
}
