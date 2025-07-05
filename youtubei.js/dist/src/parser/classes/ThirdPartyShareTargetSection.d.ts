import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
import ShareTarget from './ShareTarget.js';
export default class ThirdPartyShareTargetSection extends YTNode {
    static type: string;
    share_targets: ObservedArray<ShareTarget>;
    constructor(data: RawNode);
}
