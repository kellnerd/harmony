import { YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
import Button from './Button.js';
import ClipCreationTextInput from './ClipCreationTextInput.js';
import ClipCreationScrubber from './ClipCreationScrubber.js';
import ClipAdState from './ClipAdState.js';
import Text from './misc/Text.js';
import { Parser } from '../index.js';
class ClipCreation extends YTNode {
    constructor(data) {
        super();
        this.user_avatar = Thumbnail.fromResponse(data.userAvatar);
        this.title_input = Parser.parseItem(data.titleInput, [ClipCreationTextInput]);
        this.scrubber = Parser.parseItem(data.scrubber, [ClipCreationScrubber]);
        this.save_button = Parser.parseItem(data.saveButton, [Button]);
        this.display_name = new Text(data.displayName);
        this.publicity_label = data.publicityLabel;
        this.cancel_button = Parser.parseItem(data.cancelButton, [Button]);
        this.ad_state_overlay = Parser.parseItem(data.adStateOverlay, [ClipAdState]);
        this.external_video_id = data.externalVideoId;
        this.publicity_label_icon = data.publicityLabelIcon;
    }
}
ClipCreation.type = 'ClipCreation';
export default ClipCreation;
//# sourceMappingURL=ClipCreation.js.map