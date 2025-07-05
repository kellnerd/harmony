import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import MultiPageMenu from '../menus/MultiPageMenu.js';
export default class GetMultiPageMenuAction extends YTNode {
    static type: string;
    menu: MultiPageMenu | null;
    constructor(data: RawNode);
}
