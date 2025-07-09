import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class ClipCreationTextInput extends YTNode {
    constructor(data) {
        super();
        this.placeholder_text = new Text(data.placeholderText);
        this.max_character_limit = data.maxCharacterLimit;
    }
}
ClipCreationTextInput.type = 'ClipCreationTextInput';
export default ClipCreationTextInput;
//# sourceMappingURL=ClipCreationTextInput.js.map