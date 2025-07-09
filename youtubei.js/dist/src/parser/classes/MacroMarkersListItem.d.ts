import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class MacroMarkersListItem extends YTNode {
    static type: string;
    title: Text;
    time_description: Text;
    thumbnail: Thumbnail[];
    on_tap_endpoint: NavigationEndpoint;
    layout: string;
    is_highlighted: boolean;
    constructor(data: RawNode);
}
