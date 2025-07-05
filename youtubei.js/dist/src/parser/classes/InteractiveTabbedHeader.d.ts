import Button from './Button.js';
import MetadataBadge from './MetadataBadge.js';
import SubscribeButton from './SubscribeButton.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class InteractiveTabbedHeader extends YTNode {
    static type: string;
    header_type: string;
    title: Text;
    description: Text;
    metadata: Text;
    badges: MetadataBadge[];
    box_art: Thumbnail[];
    banner: Thumbnail[];
    buttons: ObservedArray<SubscribeButton | Button>;
    auto_generated: Text;
    constructor(data: RawNode);
}
