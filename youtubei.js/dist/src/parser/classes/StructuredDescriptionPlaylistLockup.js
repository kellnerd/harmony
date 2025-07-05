import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class StructuredDescriptionPlaylistLockup extends YTNode {
    constructor(data) {
        super();
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
        this.title = new Text(data.title);
        this.short_byline_text = new Text(data.shortBylineText);
        this.video_count_short_text = new Text(data.videoCountShortText);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.thumbnail_width = data.thumbnailWidth;
        this.aspect_ratio = data.aspectRatio;
        this.max_lines_title = data.maxLinesTitle;
        this.max_lines_short_byline_text = data.maxLinesShortBylineText;
        this.overlay_position = data.overlayPosition;
    }
}
StructuredDescriptionPlaylistLockup.type = 'StructuredDescriptionPlaylistLockup';
export default StructuredDescriptionPlaylistLockup;
//# sourceMappingURL=StructuredDescriptionPlaylistLockup.js.map