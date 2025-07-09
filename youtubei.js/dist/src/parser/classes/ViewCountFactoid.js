import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Factoid from './Factoid.js';
class ViewCountFactoid extends YTNode {
    constructor(data) {
        super();
        this.view_count_entity_key = data.viewCountEntityKey;
        this.factoid = Parser.parseItem(data.factoid, [Factoid]);
        this.view_count_type = data.viewCountType;
    }
}
ViewCountFactoid.type = 'ViewCountFactoid';
export default ViewCountFactoid;
//# sourceMappingURL=ViewCountFactoid.js.map