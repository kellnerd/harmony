import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ThumbnailOverlayTimeStatus extends YTNode {
    static type: string;
    text: string;
    style: string;
    constructor(data: RawNode);
}
