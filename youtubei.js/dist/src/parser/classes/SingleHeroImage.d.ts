import Thumbnail from './misc/Thumbnail.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class SingleHeroImage extends YTNode {
    static type: string;
    thumbnails: Thumbnail[];
    style: string;
    constructor(data: RawNode);
}
