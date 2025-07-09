import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class ChannelExternalLinkView extends YTNode {
    static type: string;
    title: Text;
    link: Text;
    favicon: Thumbnail[];
    constructor(data: RawNode);
}
