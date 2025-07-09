import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class GameCard extends YTNode {
    constructor(data) {
        super();
        this.game = Parser.parseItem(data.game);
    }
}
GameCard.type = 'GameCard';
export default GameCard;
//# sourceMappingURL=GameCard.js.map