import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import StructuredDescriptionPlaylistLockup from './StructuredDescriptionPlaylistLockup.js';
import Text from './misc/Text.js';
class VideoDescriptionCourseSection extends YTNode {
    constructor(data) {
        super();
        this.section_title = new Text(data.sectionTitle);
        this.media_lockups = Parser.parseArray(data.mediaLockups, [StructuredDescriptionPlaylistLockup]);
    }
}
VideoDescriptionCourseSection.type = 'VideoDescriptionCourseSection';
export default VideoDescriptionCourseSection;
//# sourceMappingURL=VideoDescriptionCourseSection.js.map