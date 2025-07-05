import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import { Text } from '../misc.js';
import CarouselLockup from './CarouselLockup.js';
class VideoDescriptionMusicSection extends YTNode {
    constructor(data) {
        super();
        this.carousel_lockups = Parser.parseArray(data.carouselLockups, CarouselLockup);
        this.section_title = new Text(data.sectionTitle);
    }
}
VideoDescriptionMusicSection.type = 'VideoDescriptionMusicSection';
export default VideoDescriptionMusicSection;
//# sourceMappingURL=VideoDescriptionMusicSection.js.map