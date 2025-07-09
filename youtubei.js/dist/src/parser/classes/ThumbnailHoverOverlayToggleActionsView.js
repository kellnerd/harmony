import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ToggleButtonView from './ToggleButtonView.js';
class ThumbnailHoverOverlayToggleActionsView extends YTNode {
    constructor(data) {
        super();
        this.buttons = Parser.parseArray(data.buttons, ToggleButtonView);
    }
}
ThumbnailHoverOverlayToggleActionsView.type = 'ThumbnailHoverOverlayToggleActionsView';
export default ThumbnailHoverOverlayToggleActionsView;
//# sourceMappingURL=ThumbnailHoverOverlayToggleActionsView.js.map