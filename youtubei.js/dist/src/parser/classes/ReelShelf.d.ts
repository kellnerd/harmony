import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class ReelShelf extends YTNode {
    static type: string;
    title: Text;
    items: ObservedArray<YTNode>;
    endpoint?: NavigationEndpoint;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
