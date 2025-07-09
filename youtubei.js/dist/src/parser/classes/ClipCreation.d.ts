import { YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
import Button from './Button.js';
import ClipCreationTextInput from './ClipCreationTextInput.js';
import ClipCreationScrubber from './ClipCreationScrubber.js';
import ClipAdState from './ClipAdState.js';
import Text from './misc/Text.js';
import type { RawNode } from '../types/index.js';
export default class ClipCreation extends YTNode {
    static type: string;
    user_avatar: Thumbnail[];
    title_input: ClipCreationTextInput | null;
    scrubber: ClipCreationScrubber | null;
    save_button: Button | null;
    display_name: Text;
    publicity_label: string;
    cancel_button: Button | null;
    ad_state_overlay: ClipAdState | null;
    external_video_id: string;
    publicity_label_icon: string;
    constructor(data: RawNode);
}
