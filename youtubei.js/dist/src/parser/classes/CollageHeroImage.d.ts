import NavigationEndpoint from './NavigationEndpoint.js';
import Thumbnail from './misc/Thumbnail.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class CollageHeroImage extends YTNode {
    static type: string;
    left: Thumbnail[];
    top_right: Thumbnail[];
    bottom_right: Thumbnail[];
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
