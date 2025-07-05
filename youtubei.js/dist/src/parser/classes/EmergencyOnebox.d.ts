import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
export default class EmergencyOnebox extends YTNode {
    static type: string;
    title: Text;
    first_option: YTNode;
    menu: Menu | null;
    constructor(data: RawNode);
}
