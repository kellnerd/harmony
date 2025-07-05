import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class SettingBoolean extends YTNode {
    static type: string;
    title?: Text;
    summary?: Text;
    enable_endpoint?: NavigationEndpoint;
    disable_endpoint?: NavigationEndpoint;
    item_id: string;
    constructor(data: RawNode);
}
