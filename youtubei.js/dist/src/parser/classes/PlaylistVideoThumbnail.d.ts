import Thumbnail from './misc/Thumbnail.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class PlaylistVideoThumbnail extends YTNode {
    static type: string;
    thumbnail: Thumbnail[];
    constructor(data: RawNode);
}
