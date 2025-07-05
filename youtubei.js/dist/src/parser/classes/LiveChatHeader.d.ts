import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import SortFilterSubMenu from './SortFilterSubMenu.js';
import Menu from './menus/Menu.js';
export default class LiveChatHeader extends YTNode {
    static type: string;
    overflow_menu: Menu | null;
    collapse_button: Button | null;
    view_selector: SortFilterSubMenu | null;
    constructor(data: RawNode);
}
