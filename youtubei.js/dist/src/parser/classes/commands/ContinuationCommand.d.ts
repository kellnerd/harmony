import { YTNode } from '../../helpers.js';
import type { ContinuationRequest, IEndpoint, RawNode } from '../../index.js';
export default class ContinuationCommand extends YTNode implements IEndpoint<ContinuationRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): ContinuationRequest;
}
