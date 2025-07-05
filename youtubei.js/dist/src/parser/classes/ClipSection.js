import { YTNode } from '../helpers.js';
import ClipCreation from './ClipCreation.js';
import { Parser } from '../index.js';
class ClipSection extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parse(data.contents, true, [ClipCreation]);
    }
}
ClipSection.type = 'ClipSection';
export default ClipSection;
//# sourceMappingURL=ClipSection.js.map