import { YTNode, type ObservedArray } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
import SearchFilter from './SearchFilter.js';
export default class SearchFilterGroup extends YTNode {
    static type: string;
    title: Text;
    filters: ObservedArray<SearchFilter>;
    constructor(data: RawNode);
}
