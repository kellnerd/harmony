import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class VerticalList extends YTNode {
    static type: string;
    items: ObservedArray<YTNode>;
    collapsed_item_count: string;
    collapsed_state_button_text: Text;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
