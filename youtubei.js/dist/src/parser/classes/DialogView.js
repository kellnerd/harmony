import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import DialogHeaderView from './DialogHeaderView.js';
import FormFooterView from './FormFooterView.js';
import CreatePlaylistDialogFormView from './CreatePlaylistDialogFormView.js';
import PanelFooterView from './PanelFooterView.js';
class DialogView extends YTNode {
    constructor(data) {
        super();
        this.header = Parser.parseItem(data.header, DialogHeaderView);
        this.footer = Parser.parseItem(data.footer, [FormFooterView, PanelFooterView]);
        this.custom_content = Parser.parseItem(data.customContent, CreatePlaylistDialogFormView);
    }
}
DialogView.type = 'DialogView';
export default DialogView;
//# sourceMappingURL=DialogView.js.map