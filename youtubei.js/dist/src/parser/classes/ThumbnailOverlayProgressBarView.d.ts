import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class ThumbnailOverlayProgressBarView extends YTNode {
    static type: string;
    start_percent: number;
    constructor(data: RawNode);
}
