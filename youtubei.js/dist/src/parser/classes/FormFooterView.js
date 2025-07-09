import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import PanelFooterView from './PanelFooterView.js';
class FormFooterView extends YTNode {
    constructor(data) {
        super();
        this.panel_footer = Parser.parseItem(data.panelFooter, PanelFooterView);
        this.form_id = data.formId;
        this.container_type = data.containerType;
    }
}
FormFooterView.type = 'FormFooterView';
export default FormFooterView;
//# sourceMappingURL=FormFooterView.js.map