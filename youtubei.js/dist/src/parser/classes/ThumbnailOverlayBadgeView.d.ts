import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ThumbnailBadgeView from './ThumbnailBadgeView.js';
export default class ThumbnailOverlayBadgeView extends YTNode {
    static type: string;
    badges: ThumbnailBadgeView[];
    position: string;
    constructor(data: RawNode);
}
