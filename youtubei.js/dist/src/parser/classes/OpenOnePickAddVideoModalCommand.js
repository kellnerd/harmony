import { YTNode } from '../helpers.js';
class OpenOnePickAddVideoModalCommand extends YTNode {
    constructor(data) {
        super();
        this.list_id = data.listId;
        this.modal_title = data.modalTitle;
        this.select_button_label = data.selectButtonLabel;
    }
}
OpenOnePickAddVideoModalCommand.type = 'OpenOnePickAddVideoModalCommand';
export default OpenOnePickAddVideoModalCommand;
//# sourceMappingURL=OpenOnePickAddVideoModalCommand.js.map