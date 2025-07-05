import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class CardCollection extends YTNode {
    static type: string;
    cards: ObservedArray<YTNode>;
    header: Text;
    allow_teaser_dismiss: boolean;
    constructor(data: RawNode);
}
