import { YTNode } from '../../helpers.js';
import type { CreateCommentRequest, IEndpoint, RawNode } from '../../index.js';
export default class CreateCommentEndpoint extends YTNode implements IEndpoint<CreateCommentRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): CreateCommentRequest;
}
