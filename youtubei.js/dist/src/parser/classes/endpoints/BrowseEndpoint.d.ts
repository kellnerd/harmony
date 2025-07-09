import { YTNode } from '../../helpers.js';
import type { BrowseRequest, IEndpoint, RawNode } from '../../index.js';
export default class BrowseEndpoint extends YTNode implements IEndpoint<BrowseRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): BrowseRequest;
}
