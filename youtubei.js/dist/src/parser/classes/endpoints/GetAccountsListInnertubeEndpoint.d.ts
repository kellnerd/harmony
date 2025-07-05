import { YTNode } from '../../helpers.js';
import type { GetAccountsListInnertubeRequest, IEndpoint, RawNode } from '../../index.js';
export default class GetAccountsListInnertubeEndpoint extends YTNode implements IEndpoint<GetAccountsListInnertubeRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): GetAccountsListInnertubeRequest;
}
