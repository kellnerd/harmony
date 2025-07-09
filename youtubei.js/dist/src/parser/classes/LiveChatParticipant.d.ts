import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class LiveChatParticipant extends YTNode {
    static type: string;
    name: Text;
    photo: Thumbnail[];
    badges: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
