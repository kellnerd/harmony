import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class PremiereTrailerBadge extends YTNode {
    constructor(data) {
        super();
        this.label = new Text(data.label);
    }
}
PremiereTrailerBadge.type = 'PremiereTrailerBadge';
export default PremiereTrailerBadge;
//# sourceMappingURL=PremiereTrailerBadge.js.map