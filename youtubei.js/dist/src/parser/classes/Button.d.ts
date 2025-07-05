import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { type AccessibilitySupportedDatas } from './misc/AccessibilityData.js';
export default class Button extends YTNode {
    static type: string;
    text?: string;
    label?: string;
    tooltip?: string;
    style?: string;
    size?: string;
    icon_type?: string;
    is_disabled?: boolean;
    target_id?: string;
    endpoint: NavigationEndpoint;
    accessibility?: AccessibilitySupportedDatas;
    constructor(data: RawNode);
}
