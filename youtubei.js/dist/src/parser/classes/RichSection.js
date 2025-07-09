import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class RichSection extends YTNode {
    constructor(data) {
        super();
        this.content = Parser.parseItem(data.content);
        this.full_bleed = !!data.fullBleed;
        if ('targetId' in data) {
            this.target_id = data.targetId;
        }
    }
}
RichSection.type = 'RichSection';
export default RichSection;
//# sourceMappingURL=RichSection.js.map