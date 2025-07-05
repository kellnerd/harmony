import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class PlayerOverflow extends YTNode {
    constructor(data) {
        super();
        this.endpoint = new NavigationEndpoint(data.endpoint);
        this.enable_listen_first = data.enableListenFirst;
    }
}
PlayerOverflow.type = 'PlayerOverflow';
export default PlayerOverflow;
//# sourceMappingURL=PlayerOverflow.js.map