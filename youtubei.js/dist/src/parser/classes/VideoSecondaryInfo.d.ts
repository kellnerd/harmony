import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
import Button from './Button.js';
import VideoOwner from './VideoOwner.js';
import SubscribeButton from './SubscribeButton.js';
import MetadataRowContainer from './MetadataRowContainer.js';
import { YTNode } from '../helpers.js';
export default class VideoSecondaryInfo extends YTNode {
    static type: string;
    owner: VideoOwner | null;
    description: Text;
    description_placeholder?: Text;
    subscribe_button: SubscribeButton | Button | null;
    metadata: MetadataRowContainer | null;
    show_more_text: Text;
    show_less_text: Text;
    default_expanded: string;
    description_collapsed_lines: string;
    constructor(data: RawNode);
}
