import { YTNode } from '../../helpers.js';
import type { IEndpoint, RawNode, WatchNextRequest } from '../../index.js';
export default class WatchNextEndpoint extends YTNode implements IEndpoint<WatchNextRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): WatchNextRequest;
}
