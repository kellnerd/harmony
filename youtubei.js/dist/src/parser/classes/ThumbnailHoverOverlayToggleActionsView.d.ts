import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ToggleButtonView from './ToggleButtonView.js';
export default class ThumbnailHoverOverlayToggleActionsView extends YTNode {
    static type: string;
    buttons: ObservedArray<ToggleButtonView>;
    constructor(data: RawNode);
}
