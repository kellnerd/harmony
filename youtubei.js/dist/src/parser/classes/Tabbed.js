import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class Tabbed extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parse(data);
    }
}
Tabbed.type = 'Tabbed';
export default Tabbed;
//# sourceMappingURL=Tabbed.js.map