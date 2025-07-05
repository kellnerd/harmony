import { YTNode } from '../../helpers.js';
import type { IEndpoint, PerformCommentActionRequest, RawNode } from '../../index.js';
export default class PerformCommentActionEndpoint extends YTNode implements IEndpoint<PerformCommentActionRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): PerformCommentActionRequest;
}
