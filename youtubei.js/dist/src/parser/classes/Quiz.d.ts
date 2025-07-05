import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class Quiz extends YTNode {
    static type: string;
    choices: {
        text: Text;
        is_correct: boolean;
    }[];
    total_votes: Text;
    constructor(data: RawNode);
}
