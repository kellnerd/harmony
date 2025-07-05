import { YTNode } from '../helpers.js';
import type { RawNode } from '../types/index.js';
export default class BadgeView extends YTNode {
    text: string;
    style: string;
    accessibility_label: string;
    constructor(data: RawNode);
}
