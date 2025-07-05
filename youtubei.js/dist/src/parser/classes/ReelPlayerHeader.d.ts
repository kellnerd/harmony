import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
export default class ReelPlayerHeader extends YTNode {
    static type: string;
    reel_title_text: Text;
    timestamp_text: Text;
    channel_title_text: Text;
    channel_thumbnail: Thumbnail[];
    author: Author;
    constructor(data: RawNode);
}
