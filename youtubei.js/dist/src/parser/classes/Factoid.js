import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class Factoid extends YTNode {
    constructor(data) {
        super();
        this.label = new Text(data.label);
        this.value = new Text(data.value);
        this.accessibility_text = data.accessibilityText;
    }
}
Factoid.type = 'Factoid';
export default Factoid;
//# sourceMappingURL=Factoid.js.map