import { YTNode } from '../../helpers.js';
import type { IEndpoint, RawNode, WatchRequest } from '../../index.js';
export default class WatchEndpoint extends YTNode implements IEndpoint<WatchRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): WatchRequest;
}
