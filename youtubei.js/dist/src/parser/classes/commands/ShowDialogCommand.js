import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
class ShowDialogCommand extends YTNode {
    constructor(data) {
        super();
        this.inline_content = Parser.parseItem(data.panelLoadingStrategy?.inlineContent);
        this.remove_default_padding = !!data.removeDefaultPadding;
    }
}
ShowDialogCommand.type = 'ShowDialogCommand';
export default ShowDialogCommand;
//# sourceMappingURL=ShowDialogCommand.js.map