import { YTNode, type SuperParsedResult } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class Tabbed extends YTNode {
    static type: string;
    contents: SuperParsedResult<YTNode>;
    constructor(data: RawNode);
}
