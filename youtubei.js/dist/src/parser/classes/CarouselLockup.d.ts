import { type ObservedArray, YTNode } from '../helpers.js';
import InfoRow from './InfoRow.js';
import { type RawNode } from '../index.js';
import CompactVideo from './CompactVideo.js';
export default class CarouselLockup extends YTNode {
    static type: string;
    info_rows: ObservedArray<InfoRow>;
    video_lockup?: CompactVideo | null;
    constructor(data: RawNode);
}
