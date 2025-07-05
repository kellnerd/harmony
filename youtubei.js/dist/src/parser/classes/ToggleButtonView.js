import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ButtonView from './ButtonView.js';
class ToggleButtonView extends YTNode {
    constructor(data) {
        super();
        this.default_button = Parser.parseItem(data.defaultButtonViewModel, ButtonView);
        this.toggled_button = Parser.parseItem(data.toggledButtonViewModel, ButtonView);
        this.is_toggling_disabled = data.isTogglingDisabled;
        this.identifier = data.identifier;
        if (Reflect.has(data, 'isToggled')) {
            this.is_toggled = data.isToggled;
        }
    }
}
ToggleButtonView.type = 'ToggleButtonView';
export default ToggleButtonView;
//# sourceMappingURL=ToggleButtonView.js.map