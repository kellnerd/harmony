import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import PlayerOverflow from './PlayerOverflow.js';
export default class PlayerControlsOverlay extends YTNode {
    static type: string;
    overflow: PlayerOverflow | null;
    constructor(data: RawNode);
}
