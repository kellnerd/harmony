import { YTNode } from '../../helpers.js';
import type { IEndpoint, PlaylistEditRequest, RawNode } from '../../index.js';
export default class PlaylistEditEndpoint extends YTNode implements IEndpoint<PlaylistEditRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): PlaylistEditRequest;
}
