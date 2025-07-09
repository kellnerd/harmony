import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import AnimatedThumbnailOverlayView from './AnimatedThumbnailOverlayView.js';
import ThumbnailHoverOverlayView from './ThumbnailHoverOverlayView.js';
import ThumbnailOverlayBadgeView from './ThumbnailOverlayBadgeView.js';
import Thumbnail from './misc/Thumbnail.js';
import ThumbnailHoverOverlayToggleActionsView from './ThumbnailHoverOverlayToggleActionsView.js';
import ThumbnailBottomOverlayView from './ThumbnailBottomOverlayView.js';
export type ThumbnailBackgroundColor = {
    light_theme: number;
    dark_theme: number;
};
export default class ThumbnailView extends YTNode {
    static type: string;
    image: Thumbnail[];
    overlays: ObservedArray<ThumbnailHoverOverlayToggleActionsView | ThumbnailBottomOverlayView | ThumbnailOverlayBadgeView | ThumbnailHoverOverlayView | AnimatedThumbnailOverlayView>;
    background_color?: ThumbnailBackgroundColor;
    constructor(data: RawNode);
}
