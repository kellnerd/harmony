import Text from './misc/Text.js';
import { type ObservedArray, YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class GuideSection extends YTNode {
    static type: string;
    title?: Text;
    items: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
