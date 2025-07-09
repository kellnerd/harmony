import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ThumbnailOverlayEndorsement extends YTNode {
    static type: string;
    text: string;
    constructor(data: RawNode);
}
