import { type RawNode } from '../index.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class EndscreenElement extends YTNode {
    static type: string;
    style: string;
    title: Text;
    endpoint: NavigationEndpoint;
    image?: Thumbnail[];
    icon?: Thumbnail[];
    metadata?: Text;
    call_to_action?: Text;
    hovercard_button?: YTNode;
    is_subscribe?: boolean;
    playlist_length?: Text;
    thumbnail_overlays?: ObservedArray<YTNode>;
    left: number;
    top: number;
    width: number;
    aspect_ratio: number;
    start_ms: number;
    end_ms: number;
    id: string;
    constructor(data: RawNode);
}
