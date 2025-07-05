import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import ChipCloud from './ChipCloud.js';
export default class SearchHeader extends YTNode {
    static type: string;
    chip_bar: ChipCloud | null;
    search_filter_button: Button | null;
    constructor(data: RawNode);
}
