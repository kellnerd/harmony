import { YTNode } from '../../helpers.js';
import type { IEndpoint, RawNode, UnsubscribeRequest } from '../../index.js';
export default class UnsubscribeEndpoint extends YTNode implements IEndpoint<UnsubscribeRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): UnsubscribeRequest;
}
