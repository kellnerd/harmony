import { YTNode } from '../../helpers.js';
import type { IEndpoint, RawNode, LiveChatItemContextMenuRequest } from '../../index.js';
export default class LiveChatItemContextMenuEndpoint extends YTNode implements IEndpoint<LiveChatItemContextMenuRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): LiveChatItemContextMenuRequest;
}
