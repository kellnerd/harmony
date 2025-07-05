import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ThumbnailOverlayToggleButton extends YTNode {
    static type: string;
    is_toggled?: boolean;
    icon_type: {
        toggled: string;
        untoggled: string;
    };
    tooltip: {
        toggled: string;
        untoggled: string;
    };
    toggled_endpoint?: NavigationEndpoint;
    untoggled_endpoint?: NavigationEndpoint;
    constructor(data: RawNode);
}
