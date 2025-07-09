import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import ShareTarget from './ShareTarget.js';
class ThirdPartyShareTargetSection extends YTNode {
    constructor(data) {
        super();
        this.share_targets = Parser.parseArray(data.shareTargets, ShareTarget);
    }
}
ThirdPartyShareTargetSection.type = 'ThirdPartyShareTargetSection';
export default ThirdPartyShareTargetSection;
//# sourceMappingURL=ThirdPartyShareTargetSection.js.map