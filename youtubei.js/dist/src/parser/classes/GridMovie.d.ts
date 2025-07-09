import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import MetadataBadge from './MetadataBadge.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class GridMovie extends YTNode {
    static type: string;
    id: string;
    title: Text;
    thumbnails: Thumbnail[];
    duration: Text | null;
    endpoint: NavigationEndpoint;
    badges: ObservedArray<MetadataBadge>;
    metadata: Text;
    thumbnail_overlays: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
