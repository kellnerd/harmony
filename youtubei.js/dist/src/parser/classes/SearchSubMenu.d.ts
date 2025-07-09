import { type ObservedArray, YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
import SearchFilterGroup from './SearchFilterGroup.js';
import ToggleButton from './ToggleButton.js';
export default class SearchSubMenu extends YTNode {
    static type: string;
    title?: Text;
    groups?: ObservedArray<SearchFilterGroup>;
    button?: ToggleButton | null;
    constructor(data: RawNode);
}
