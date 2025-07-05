import { type ObservedArray, YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
export default class SignalServiceEndpoint extends YTNode {
    static type: string;
    actions?: ObservedArray<YTNode>;
    signal?: string;
    constructor(data: RawNode);
}
