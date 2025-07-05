import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class SignalAction extends YTNode {
    static type: string;
    signal: string;
    constructor(data: RawNode);
}
