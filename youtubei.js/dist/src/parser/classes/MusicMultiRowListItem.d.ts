import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import { Text } from '../misc.js';
import Menu from './menus/Menu.js';
import MusicItemThumbnailOverlay from './MusicItemThumbnailOverlay.js';
import MusicThumbnail from './MusicThumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class MusicMultiRowListItem extends YTNode {
    static type: string;
    thumbnail: MusicThumbnail | null;
    overlay: MusicItemThumbnailOverlay | null;
    on_tap: NavigationEndpoint;
    menu: Menu | null;
    subtitle: Text;
    title: Text;
    second_title?: Text;
    description?: Text;
    display_style?: string;
    constructor(data: RawNode);
}
