import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class CompactLink extends YTNode {
    static type: string;
    title: string;
    subtitle?: Text;
    endpoint: NavigationEndpoint;
    style: string;
    icon_type?: string;
    secondary_icon_type?: string;
    constructor(data: RawNode);
}
