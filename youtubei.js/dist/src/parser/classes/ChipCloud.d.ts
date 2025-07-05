import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import ChipCloudChip from './ChipCloudChip.js';
export default class ChipCloud extends YTNode {
    static type: string;
    chips: ObservedArray<ChipCloudChip>;
    next_button: Button | null;
    previous_button: Button | null;
    horizontal_scrollable: boolean;
    constructor(data: RawNode);
}
