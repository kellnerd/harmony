import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class ChannelFeaturedContent extends YTNode {
    static type: string;
    title: Text;
    items: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
