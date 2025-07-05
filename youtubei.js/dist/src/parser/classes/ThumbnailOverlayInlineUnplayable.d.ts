import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ThumbnailOverlayInlineUnplayable extends YTNode {
    static type: string;
    text: string;
    icon_type: string;
    constructor(data: RawNode);
}
