import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class ChipView extends YTNode {
    static type: string;
    text: string;
    display_type: string;
    endpoint: NavigationEndpoint;
    chip_entity_key: string;
    constructor(data: RawNode);
}
