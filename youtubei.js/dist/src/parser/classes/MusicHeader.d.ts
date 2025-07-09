import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
export default class MusicHeader extends YTNode {
    static type: string;
    header?: YTNode;
    title?: Text;
    constructor(data: RawNode);
}
