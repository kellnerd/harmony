import { type ObservedArray, YTNode } from '../helpers.js';
export default class Endscreen extends YTNode {
    static type: string;
    elements: ObservedArray<YTNode>;
    start_ms: string;
    constructor(data: any);
}
