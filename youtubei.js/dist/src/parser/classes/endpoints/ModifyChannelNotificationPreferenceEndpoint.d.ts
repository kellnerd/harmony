import { YTNode } from '../../helpers.js';
import type { IEndpoint, ModifyChannelNotificationPreferenceRequest, RawNode } from '../../index.js';
export default class ModifyChannelNotificationPreferenceEndpoint extends YTNode implements IEndpoint<ModifyChannelNotificationPreferenceRequest> {
    #private;
    static type: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): ModifyChannelNotificationPreferenceRequest;
}
