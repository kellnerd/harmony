import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class ExpandableTab extends YTNode {
    static type: string;
    title: string;
    endpoint: NavigationEndpoint;
    selected: boolean;
    content: YTNode;
    constructor(data: RawNode);
}
