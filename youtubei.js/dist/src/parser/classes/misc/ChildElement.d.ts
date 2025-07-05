import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class ChildElement extends YTNode {
    static type: string;
    text?: string;
    properties: any;
    child_elements?: ChildElement[];
    constructor(data: RawNode);
}
