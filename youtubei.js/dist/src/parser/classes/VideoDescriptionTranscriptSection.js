import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import { Text } from '../misc.js';
import Button from './Button.js';
class VideoDescriptionTranscriptSection extends YTNode {
    constructor(data) {
        super();
        this.section_title = new Text(data.sectionTitle);
        this.sub_header_text = new Text(data.subHeaderText);
        this.primary_button = Parser.parseItem(data.primaryButton, Button);
    }
}
VideoDescriptionTranscriptSection.type = 'VideoDescriptionTranscriptSection';
export default VideoDescriptionTranscriptSection;
//# sourceMappingURL=VideoDescriptionTranscriptSection.js.map