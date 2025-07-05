import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { type AccessibilitySupportedDatas } from './misc/AccessibilityData.js';
export default class ChannelThumbnailWithLink extends YTNode {
    static type: string;
    thumbnails: Thumbnail[];
    endpoint: NavigationEndpoint;
    accessibility?: AccessibilitySupportedDatas;
    constructor(data: RawNode);
    get label(): string | undefined;
}
