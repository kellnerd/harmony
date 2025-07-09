import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class ThumbnailOverlayPlaybackStatus extends YTNode {
    static type: string;
    texts: Text[];
    constructor(data: RawNode);
}
