import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Factoid from './Factoid.js';
class UploadTimeFactoid extends YTNode {
    constructor(data) {
        super();
        this.factoid = Parser.parseItem(data.factoid, Factoid);
    }
}
UploadTimeFactoid.type = 'UploadTimeFactoid';
export default UploadTimeFactoid;
//# sourceMappingURL=UploadTimeFactoid.js.map