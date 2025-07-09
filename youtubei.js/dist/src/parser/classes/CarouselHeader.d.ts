import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class CarouselHeader extends YTNode {
    static type: string;
    contents: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
