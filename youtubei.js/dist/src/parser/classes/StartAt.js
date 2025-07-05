import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class StartAt extends YTNode {
    constructor(data) {
        super();
        this.start_at_option_label = new Text(data.startAtOptionLabel);
    }
}
StartAt.type = 'StartAt';
export default StartAt;
//# sourceMappingURL=StartAt.js.map