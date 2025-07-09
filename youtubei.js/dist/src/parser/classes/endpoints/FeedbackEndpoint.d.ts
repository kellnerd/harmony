import { YTNode } from '../../helpers.js';
import type { FeedbackRequest, IEndpoint, RawNode } from '../../index.js';
export default class FeedbackEndpoint extends YTNode implements IEndpoint<FeedbackRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): FeedbackRequest;
}
