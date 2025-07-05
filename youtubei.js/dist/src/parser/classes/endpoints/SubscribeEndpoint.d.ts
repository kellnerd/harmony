import { YTNode } from '../../helpers.js';
import type { IEndpoint, RawNode, SubscribeRequest } from '../../index.js';
export default class SubscribeEndpoint extends YTNode implements IEndpoint<SubscribeRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): SubscribeRequest;
}
