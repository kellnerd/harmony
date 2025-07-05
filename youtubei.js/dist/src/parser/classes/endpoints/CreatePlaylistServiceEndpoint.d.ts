import { YTNode } from '../../helpers.js';
import type { CreatePlaylistServiceRequest, IEndpoint, RawNode } from '../../index.js';
export default class CreatePlaylistServiceEndpoint extends YTNode implements IEndpoint<CreatePlaylistServiceRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): CreatePlaylistServiceRequest;
}
