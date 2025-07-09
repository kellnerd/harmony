import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import ChipView from './ChipView.js';
export default class ChipBarView extends YTNode {
    static type: string;
    chips: ObservedArray<ChipView> | null;
    constructor(data: RawNode);
}
