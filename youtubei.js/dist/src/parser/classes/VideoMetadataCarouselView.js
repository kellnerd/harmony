import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import CarouselItemView from './CarouselItemView.js';
import CarouselTitleView from './CarouselTitleView.js';
class VideoMetadataCarouselView extends YTNode {
    constructor(data) {
        super();
        this.carousel_titles = Parser.parse(data.carouselTitles, true, CarouselTitleView);
        this.carousel_items = Parser.parse(data.carouselItems, true, CarouselItemView);
    }
}
VideoMetadataCarouselView.type = 'VideoMetadataCarouselView';
export default VideoMetadataCarouselView;
//# sourceMappingURL=VideoMetadataCarouselView.js.map