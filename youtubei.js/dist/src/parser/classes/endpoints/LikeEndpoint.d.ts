import { YTNode } from '../../helpers.js';
import type { IEndpoint, LikeRequest, RawNode } from '../../index.js';
export default class LikeEndpoint extends YTNode implements IEndpoint<LikeRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): LikeRequest;
    getParams(): string | undefined;
}
