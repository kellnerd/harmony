import type { ObservedArray } from '../../helpers.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import Text from '../misc/Text.js';
import MusicMenuItemDivider from './MusicMenuItemDivider.js';
import MusicMultiSelectMenuItem from './MusicMultiSelectMenuItem.js';
export default class MusicMultiSelectMenu extends YTNode {
    static type: string;
    title?: Text;
    options: ObservedArray<MusicMultiSelectMenuItem | MusicMenuItemDivider>;
    constructor(data: RawNode);
}
