import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class AttributionView extends YTNode {
    constructor(data) {
        super();
        this.text = Text.fromAttributed(data.text);
        this.suffix = Text.fromAttributed(data.suffix);
    }
}
AttributionView.type = 'AttributionView';
export default AttributionView;
//# sourceMappingURL=AttributionView.js.map