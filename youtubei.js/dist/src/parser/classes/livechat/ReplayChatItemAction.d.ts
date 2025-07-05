import { type ObservedArray, YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class ReplayChatItemAction extends YTNode {
    static type: string;
    actions: ObservedArray<YTNode>;
    video_offset_time_msec: string;
    constructor(data: RawNode);
}
