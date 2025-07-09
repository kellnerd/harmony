import { YTNode } from '../../helpers.js';
import type { IEndpoint, RawNode, ReelWatchRequest } from '../../index.js';
export default class ReelWatchEndpoint extends YTNode implements IEndpoint<ReelWatchRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): ReelWatchRequest;
}
