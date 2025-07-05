import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class GameDetails extends YTNode {
    static type: string;
    title: Text;
    box_art: Thumbnail[];
    box_art_overlay_text: Text;
    endpoint: NavigationEndpoint;
    is_official_box_art: boolean;
    constructor(data: RawNode);
}
