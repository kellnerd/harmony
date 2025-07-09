import { YTNode } from '../../helpers.js';
import type { IEndpoint, RawNode, SearchRequest } from '../../index.js';
export default class SearchEndpoint extends YTNode implements IEndpoint<SearchRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): SearchRequest;
}
