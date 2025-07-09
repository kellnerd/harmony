import { YTNode } from '../../helpers.js';
import type { IEndpoint, RawNode, ShareEntityServiceRequest } from '../../index.js';
export default class ShareEntityServiceEndpoint extends YTNode implements IEndpoint<ShareEntityServiceRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): ShareEntityServiceRequest;
}
