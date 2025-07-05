import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class DownloadButton extends YTNode {
    static type: string;
    style: string;
    size: string;
    endpoint: NavigationEndpoint;
    target_id: string;
    constructor(data: RawNode);
}
