import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import SortFilterSubMenu from './SortFilterSubMenu.js';
export default class TranscriptFooter extends YTNode {
    static type: string;
    language_menu: SortFilterSubMenu | null;
    constructor(data: RawNode);
}
