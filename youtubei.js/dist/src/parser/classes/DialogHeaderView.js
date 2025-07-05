import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class DialogHeaderView extends YTNode {
    constructor(data) {
        super();
        this.headline = Text.fromAttributed(data.headline);
    }
}
DialogHeaderView.type = 'DialogHeaderView';
export default DialogHeaderView;
//# sourceMappingURL=DialogHeaderView.js.map