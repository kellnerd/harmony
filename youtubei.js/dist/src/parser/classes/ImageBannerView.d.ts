import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Thumbnail from './misc/Thumbnail.js';
export default class ImageBannerView extends YTNode {
    static type: string;
    image: Thumbnail[];
    style: string;
    constructor(data: RawNode);
}
