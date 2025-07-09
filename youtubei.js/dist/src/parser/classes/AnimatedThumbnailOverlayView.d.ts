import { YTNode } from '../helpers.js';
import type { RawNode } from '../types/index.js';
import Thumbnail from './misc/Thumbnail.js';
export default class AnimatedThumbnailOverlayView extends YTNode {
    static type: string;
    thumbnail: Thumbnail[];
    constructor(data: RawNode);
}
