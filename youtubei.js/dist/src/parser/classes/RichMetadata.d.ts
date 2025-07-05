import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class RichMetadata extends YTNode {
    static type: string;
    thumbnail: Thumbnail[];
    title: Text;
    subtitle: Text;
    call_to_action: Text;
    icon_type?: string;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
