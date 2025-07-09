import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import ClipCreation from './ClipCreation.js';
import type { RawNode } from '../types/index.js';
export default class ClipSection extends YTNode {
    static type: string;
    contents: ObservedArray<ClipCreation> | null;
    constructor(data: RawNode);
}
