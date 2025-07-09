import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class MusicVisualHeader extends YTNode {
    static type: string;
    title: Text;
    thumbnail: Thumbnail[];
    menu: Menu | null;
    foreground_thumbnail: Thumbnail[];
    constructor(data: RawNode);
}
