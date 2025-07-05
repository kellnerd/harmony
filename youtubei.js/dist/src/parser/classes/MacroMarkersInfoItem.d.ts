import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
export default class MacroMarkersInfoItem extends YTNode {
    static type: string;
    info_text: Text;
    menu: Menu | null;
    constructor(data: RawNode);
}
