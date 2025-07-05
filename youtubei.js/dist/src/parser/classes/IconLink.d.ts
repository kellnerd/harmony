import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class IconLink extends YTNode {
    static type: string;
    icon_type: string;
    tooltip?: string;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
