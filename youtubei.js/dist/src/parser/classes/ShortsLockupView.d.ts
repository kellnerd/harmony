import { YTNode } from '../helpers.js';
import type { RawNode } from '../types/index.js';
import BadgeView from './BadgeView.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class ShortsLockupView extends YTNode {
    static type: string;
    entity_id: string;
    accessibility_text: string;
    thumbnail: Thumbnail[];
    on_tap_endpoint: NavigationEndpoint;
    menu_on_tap: NavigationEndpoint;
    index_in_collection: number;
    menu_on_tap_a11y_label: string;
    overlay_metadata: {
        primary_text?: Text;
        secondary_text?: Text;
    };
    inline_player_data?: NavigationEndpoint;
    badge?: BadgeView | null;
    constructor(data: RawNode);
}
