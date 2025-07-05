import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { type AccessibilitySupportedDatas } from './misc/AccessibilityData.js';
export default class MusicInlineBadge extends YTNode {
    static type: string;
    icon_type: string;
    accessibility?: AccessibilitySupportedDatas;
    constructor(data: RawNode);
    get label(): string | undefined;
}
