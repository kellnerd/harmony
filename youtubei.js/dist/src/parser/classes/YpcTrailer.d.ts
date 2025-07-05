import { YTNode } from '../helpers.js';
import type { IRawResponse, RawNode } from '../index.js';
export default class YpcTrailer extends YTNode {
    static type: string;
    video_message: string;
    player_response: IRawResponse;
    constructor(data: RawNode);
}
