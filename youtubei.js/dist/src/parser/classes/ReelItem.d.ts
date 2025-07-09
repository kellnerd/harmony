import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import { type AccessibilitySupportedDatas } from './misc/AccessibilityData.js';
export default class ReelItem extends YTNode {
    static type: string;
    id: string;
    title: Text;
    thumbnails: Thumbnail[];
    views: Text;
    endpoint: NavigationEndpoint;
    accessibility?: AccessibilitySupportedDatas;
    constructor(data: RawNode);
    get label(): string | undefined;
}
