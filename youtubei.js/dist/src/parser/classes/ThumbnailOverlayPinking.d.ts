import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ThumbnailOverlayPinking extends YTNode {
    static type: string;
    hack: boolean;
    constructor(data: RawNode);
}
