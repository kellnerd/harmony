import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import DropdownItem from './DropdownItem.js';
export default class Dropdown extends YTNode {
    static type: string;
    label: string;
    entries: ObservedArray<DropdownItem>;
    constructor(data: RawNode);
}
