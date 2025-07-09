import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class MetadataBadge extends YTNode {
    static type: string;
    icon_type?: string;
    style?: string;
    label?: string;
    tooltip?: string;
    constructor(data: RawNode);
}
