import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class VerticalWatchCardList extends YTNode {
    static type: string;
    items: ObservedArray<YTNode>;
    view_all_text: Text;
    view_all_endpoint: NavigationEndpoint;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
