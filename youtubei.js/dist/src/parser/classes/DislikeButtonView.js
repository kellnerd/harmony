import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ToggleButtonView from './ToggleButtonView.js';
class DislikeButtonView extends YTNode {
    constructor(data) {
        super();
        this.toggle_button = Parser.parseItem(data.toggleButtonViewModel, ToggleButtonView);
        this.dislike_entity_key = data.dislikeEntityKey;
    }
}
DislikeButtonView.type = 'DislikeButtonView';
export default DislikeButtonView;
//# sourceMappingURL=DislikeButtonView.js.map