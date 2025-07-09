import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class VideoDescriptionInfocardsSection extends YTNode {
    static type: string;
    section_title: Text;
    creator_videos_button: Button | null;
    creator_about_button: Button | null;
    section_subtitle: Text;
    channel_avatar: Thumbnail[];
    channel_endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
