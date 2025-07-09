import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ToggleButton extends YTNode {
    static type: string;
    text: Text;
    toggled_text: Text;
    tooltip: string;
    toggled_tooltip: string;
    is_toggled: boolean;
    is_disabled: boolean;
    icon_type: string;
    like_count?: number;
    short_like_count?: string;
    endpoint: NavigationEndpoint;
    toggled_endpoint: NavigationEndpoint;
    button_id?: string;
    target_id?: string;
    constructor(data: RawNode);
}
