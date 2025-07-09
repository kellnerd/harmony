import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import ContentPreviewImageView from './ContentPreviewImageView.js';
import type { RawNode } from '../types/index.js';
import Thumbnail from './misc/Thumbnail.js';
export default class VideoAttributeView extends YTNode {
    static type: string;
    image: ContentPreviewImageView | Thumbnail[] | null;
    image_style: string;
    title: string;
    subtitle: string;
    secondary_subtitle?: {
        content: string;
    };
    orientation: string;
    sizing_rule: string;
    overflow_menu_on_tap: NavigationEndpoint;
    overflow_menu_a11y_label: string;
    constructor(data: RawNode);
}
