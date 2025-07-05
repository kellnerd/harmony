import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class SingleColumnMusicWatchNextResults extends YTNode {
    static type: string;
    contents: import("../helpers.js").SuperParsedResult<YTNode>;
    constructor(data: RawNode);
}
