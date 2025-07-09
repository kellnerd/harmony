import { Text } from '../misc.js';
import { YTNode } from '../helpers.js';
class PlayerOverlayVideoDetails extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.subtitle = new Text(data.subtitle);
    }
}
PlayerOverlayVideoDetails.type = 'PlayerOverlayVideoDetails';
export default PlayerOverlayVideoDetails;
//# sourceMappingURL=PlayerOverlayVideoDetails.js.map