import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class BackstageImage extends YTNode {
    static type: string;
    image: Thumbnail[];
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
