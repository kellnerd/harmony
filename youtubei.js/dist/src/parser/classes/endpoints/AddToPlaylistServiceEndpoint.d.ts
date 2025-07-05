import { YTNode } from '../../helpers.js';
import type { AddToPlaylistServiceRequest, IEndpoint, RawNode } from '../../index.js';
export default class AddToPlaylistServiceEndpoint extends YTNode implements IEndpoint<AddToPlaylistServiceRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): AddToPlaylistServiceRequest;
}
