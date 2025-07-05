import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class VideoDescriptionInfocardsSection extends YTNode {
    constructor(data) {
        super();
        this.section_title = new Text(data.sectionTitle);
        this.creator_videos_button = Parser.parseItem(data.creatorVideosButton, Button);
        this.creator_about_button = Parser.parseItem(data.creatorAboutButton, Button);
        this.section_subtitle = new Text(data.sectionSubtitle);
        this.channel_avatar = Thumbnail.fromResponse(data.channelAvatar);
        this.channel_endpoint = new NavigationEndpoint(data.channelEndpoint);
    }
}
VideoDescriptionInfocardsSection.type = 'VideoDescriptionInfocardsSection';
export default VideoDescriptionInfocardsSection;
//# sourceMappingURL=VideoDescriptionInfocardsSection.js.map