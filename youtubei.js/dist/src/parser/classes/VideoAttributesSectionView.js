import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import ButtonView from './ButtonView.js';
import VideoAttributeView from './VideoAttributeView.js';
class VideoAttributesSectionView extends YTNode {
    constructor(data) {
        super();
        this.header_title = data.headerTitle;
        this.header_subtitle = data.headerSubtitle;
        this.video_attributes = Parser.parseArray(data.videoAttributeViewModels, VideoAttributeView);
        this.previous_button = Parser.parseItem(data.previousButton, ButtonView);
        this.next_button = Parser.parseItem(data.nextButton, ButtonView);
    }
}
VideoAttributesSectionView.type = 'VideoAttributesSectionView';
export default VideoAttributesSectionView;
//# sourceMappingURL=VideoAttributesSectionView.js.map