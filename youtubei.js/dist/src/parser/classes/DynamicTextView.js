import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class DynamicTextView extends YTNode {
    constructor(data) {
        super();
        this.text = Text.fromAttributed(data.text);
        this.max_lines = parseInt(data.maxLines);
    }
}
DynamicTextView.type = 'DynamicTextView';
export default DynamicTextView;
//# sourceMappingURL=DynamicTextView.js.map