import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import PlayerOverflow from './PlayerOverflow.js';
class PlayerControlsOverlay extends YTNode {
    constructor(data) {
        super();
        this.overflow = Parser.parseItem(data.overflow, PlayerOverflow);
    }
}
PlayerControlsOverlay.type = 'PlayerControlsOverlay';
export default PlayerControlsOverlay;
//# sourceMappingURL=PlayerControlsOverlay.js.map