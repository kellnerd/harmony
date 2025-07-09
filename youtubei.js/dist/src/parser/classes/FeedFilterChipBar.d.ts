import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import ChipCloudChip from './ChipCloudChip.js';
export default class FeedFilterChipBar extends YTNode {
    static type: string;
    contents: ObservedArray<ChipCloudChip>;
    constructor(data: RawNode);
}
