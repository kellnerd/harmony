import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class ChannelOwnerEmptyState extends YTNode {
    constructor(data) {
        super();
        this.illustration = Thumbnail.fromResponse(data.illustration);
        this.description = new Text(data.description);
    }
}
ChannelOwnerEmptyState.type = 'ChannelOwnerEmptyState';
export default ChannelOwnerEmptyState;
//# sourceMappingURL=ChannelOwnerEmptyState.js.map