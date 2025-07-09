import AnchoredSection from './AnchoredSection.js';
import { type ObservedArray, YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class KidsHomeScreen extends YTNode {
    static type: string;
    anchors: ObservedArray<AnchoredSection>;
    constructor(data: RawNode);
}
