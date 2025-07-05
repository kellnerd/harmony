import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import LiveChatParticipant from './LiveChatParticipant.js';
import Text from './misc/Text.js';
export default class LiveChatParticipantsList extends YTNode {
    static type: string;
    title: Text;
    participants: ObservedArray<LiveChatParticipant>;
    constructor(data: RawNode);
}
