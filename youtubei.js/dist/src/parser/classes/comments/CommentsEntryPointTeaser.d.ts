import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class CommentsEntryPointTeaser extends YTNode {
    static type: string;
    teaser_avatar?: Thumbnail[];
    teaser_content?: Text;
    constructor(data: RawNode);
}
