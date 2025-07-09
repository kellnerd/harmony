import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Message from './Message.js';
export default class ConversationBar extends YTNode {
    static type: string;
    availability_message: Message | null;
    constructor(data: RawNode);
}
