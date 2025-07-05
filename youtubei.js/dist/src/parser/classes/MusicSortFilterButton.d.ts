import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import MusicMultiSelectMenu from './menus/MusicMultiSelectMenu.js';
export default class MusicSortFilterButton extends YTNode {
    static type: string;
    title: string;
    icon_type?: string;
    menu: MusicMultiSelectMenu | null;
    constructor(data: RawNode);
}
