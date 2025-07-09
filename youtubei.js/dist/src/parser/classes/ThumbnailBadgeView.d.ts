import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ThumbnailBadgeView extends YTNode {
    static type: string;
    icon_name?: string;
    text: string;
    badge_style: string;
    background_color?: {
        light_theme: number;
        dark_theme: number;
    };
    constructor(data: RawNode);
}
