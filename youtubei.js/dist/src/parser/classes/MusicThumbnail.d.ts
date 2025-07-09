import Thumbnail from './misc/Thumbnail.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class MusicThumbnail extends YTNode {
    static type: string;
    contents: Thumbnail[];
    constructor(data: RawNode);
}
