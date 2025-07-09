import NavigationEndpoint from './NavigationEndpoint.js';
import Thumbnail from './misc/Thumbnail.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class SearchRefinementCard extends YTNode {
    static type: string;
    thumbnails: Thumbnail[];
    endpoint: NavigationEndpoint;
    query: string;
    constructor(data: RawNode);
}
