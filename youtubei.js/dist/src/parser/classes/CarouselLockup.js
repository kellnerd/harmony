import { YTNode } from '../helpers.js';
import InfoRow from './InfoRow.js';
import { Parser } from '../index.js';
import CompactVideo from './CompactVideo.js';
class CarouselLockup extends YTNode {
    constructor(data) {
        super();
        this.info_rows = Parser.parseArray(data.infoRows, InfoRow);
        this.video_lockup = Parser.parseItem(data.videoLockup, CompactVideo);
    }
}
CarouselLockup.type = 'CarouselLockup';
export default CarouselLockup;
//# sourceMappingURL=CarouselLockup.js.map