import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class UniversalWatchCard extends YTNode {
    static type: string;
    header: YTNode;
    call_to_action: YTNode;
    sections: ObservedArray<YTNode>;
    collapsed_label?: Text;
    constructor(data: RawNode);
}
