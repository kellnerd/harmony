import NavigationEndpoint from './NavigationEndpoint.js';
import Thumbnail from './misc/Thumbnail.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export declare class Panel extends YTNode {
    static type: string;
    thumbnail?: {
        image: Thumbnail[];
        endpoint: NavigationEndpoint;
        on_long_press_endpoint: NavigationEndpoint;
        content_mode: string;
        crop_options: string;
    };
    background_image: {
        image: Thumbnail[];
        gradient_image: Thumbnail[];
    };
    strapline: string;
    title: string;
    description: string;
    text_on_tap_endpoint: NavigationEndpoint;
    cta: {
        icon_name: string;
        title: string;
        endpoint: NavigationEndpoint;
        accessibility_text: string;
        state: string;
    };
    constructor(data: RawNode);
}
export default class HighlightsCarousel extends YTNode {
    static type: string;
    panels: Panel[];
    constructor(data: RawNode);
}
