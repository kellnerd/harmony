import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class ItemSectionTab extends YTNode {
    static type: string;
    title: Text;
    selected: boolean;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
