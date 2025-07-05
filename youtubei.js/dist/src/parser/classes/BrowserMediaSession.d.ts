import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class BrowserMediaSession extends YTNode {
    static type: string;
    album: Text;
    thumbnails: Thumbnail[];
    constructor(data: RawNode);
}
