import { YTNode } from '../../helpers.js';
import type { DeletePlaylistServiceRequest, IEndpoint, RawNode } from '../../index.js';
export default class DeletePlaylistEndpoint extends YTNode implements IEndpoint<DeletePlaylistServiceRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): DeletePlaylistServiceRequest;
}
