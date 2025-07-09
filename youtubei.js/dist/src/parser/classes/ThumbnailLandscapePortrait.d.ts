import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Thumbnail from './misc/Thumbnail.js';
export default class ThumbnailLandscapePortrait extends YTNode {
    static type: string;
    landscape: Thumbnail[];
    portrait: Thumbnail[];
    constructor(data: RawNode);
}
