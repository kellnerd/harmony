import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
export default class NotificationAction extends YTNode {
    static type: string;
    response_text: Text;
    constructor(data: RawNode);
}
