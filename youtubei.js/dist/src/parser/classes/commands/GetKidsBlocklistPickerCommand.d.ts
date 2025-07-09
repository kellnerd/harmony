import { YTNode } from '../../helpers.js';
import type { GetKidsBlocklistPickerRequest, IEndpoint, RawNode } from '../../index.js';
export default class GetKidsBlocklistPickerCommand extends YTNode implements IEndpoint<GetKidsBlocklistPickerRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): GetKidsBlocklistPickerRequest;
}
