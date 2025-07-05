import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class SectionList extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents);
        if (Reflect.has(data, 'targetId')) {
            this.target_id = data.targetId;
        }
        if (Reflect.has(data, 'continuations')) {
            if (Reflect.has(data.continuations[0], 'nextContinuationData')) {
                this.continuation = data.continuations[0].nextContinuationData.continuation;
            }
            else if (Reflect.has(data.continuations[0], 'reloadContinuationData')) {
                this.continuation = data.continuations[0].reloadContinuationData.continuation;
            }
        }
        if (Reflect.has(data, 'header')) {
            this.header = Parser.parseItem(data.header);
        }
        if (Reflect.has(data, 'subMenu')) {
            this.sub_menu = Parser.parseItem(data.subMenu);
        }
    }
}
SectionList.type = 'SectionList';
export default SectionList;
//# sourceMappingURL=SectionList.js.map