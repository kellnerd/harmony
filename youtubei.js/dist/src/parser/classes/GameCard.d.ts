import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class GameCard extends YTNode {
    static type: string;
    game: YTNode;
    constructor(data: RawNode);
}
