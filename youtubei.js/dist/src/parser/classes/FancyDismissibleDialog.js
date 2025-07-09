import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class FancyDismissibleDialog extends YTNode {
    constructor(data) {
        super();
        this.dialog_message = new Text(data.dialogMessage);
        this.confirm_label = new Text(data.confirmLabel);
    }
}
FancyDismissibleDialog.type = 'FancyDismissibleDialog';
export default FancyDismissibleDialog;
//# sourceMappingURL=FancyDismissibleDialog.js.map