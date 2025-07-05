import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class SimpleCardContent extends YTNode {
    static type: string;
    image: Thumbnail[];
    title: Text;
    display_domain: Text;
    show_link_icon: boolean;
    call_to_action: Text;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
