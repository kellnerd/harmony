import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ButtonView from './ButtonView.js';
class PanelFooterView extends YTNode {
    constructor(data) {
        super();
        this.primary_button = Parser.parseItem(data.primaryButton, ButtonView);
        this.secondary_button = Parser.parseItem(data.secondaryButton, ButtonView);
        this.should_hide_divider = !!data.shouldHideDivider;
    }
}
PanelFooterView.type = 'PanelFooterView';
export default PanelFooterView;
//# sourceMappingURL=PanelFooterView.js.map