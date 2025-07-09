import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import type { RawNode } from '../index.js';
export default class AutomixPreviewVideo extends YTNode {
    static type: string;
    playlist_video?: {
        endpoint: NavigationEndpoint;
    };
    constructor(data: RawNode);
}
