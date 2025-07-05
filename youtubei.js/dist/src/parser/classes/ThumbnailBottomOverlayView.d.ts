import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ThumbnailBadgeView from './ThumbnailBadgeView.js';
import ThumbnailOverlayProgressBarView from './ThumbnailOverlayProgressBarView.js';
export default class ThumbnailBottomOverlayView extends YTNode {
    static type: string;
    progress_bar: ThumbnailOverlayProgressBarView | null;
    badges: ObservedArray<ThumbnailBadgeView>;
    constructor(data: RawNode);
}
