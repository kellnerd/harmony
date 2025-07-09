import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class ChannelOwnerEmptyState extends YTNode {
    static type: string;
    illustration: Thumbnail[];
    description: Text;
    constructor(data: RawNode);
}
