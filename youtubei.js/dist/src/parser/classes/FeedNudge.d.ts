import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import type { RawNode } from '../types/index.js';
export default class FeedNudge extends YTNode {
    static type: string;
    title: Text;
    subtitle: Text;
    endpoint: NavigationEndpoint;
    apply_modernized_style: boolean;
    trim_style: string;
    background_style: string;
    constructor(data: RawNode);
}
