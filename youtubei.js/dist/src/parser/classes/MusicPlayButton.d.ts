import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { type AccessibilitySupportedDatas } from './misc/AccessibilityData.js';
export default class MusicPlayButton extends YTNode {
    static type: string;
    endpoint: NavigationEndpoint;
    play_icon_type: string;
    pause_icon_type: string;
    icon_color: string;
    accessibility_play_data?: AccessibilitySupportedDatas;
    accessibility_pause_data?: AccessibilitySupportedDatas;
    constructor(data: RawNode);
    get play_label(): string | undefined;
    get pause_label(): string | undefined;
}
