import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class DropdownItem extends YTNode {
    static type: string;
    label: string;
    selected: boolean;
    value?: number | string;
    icon_type?: string;
    description?: Text;
    endpoint?: NavigationEndpoint;
    constructor(data: RawNode);
}
