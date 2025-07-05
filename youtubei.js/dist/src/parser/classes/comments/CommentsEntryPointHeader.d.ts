import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import CommentsSimplebox from './CommentsSimplebox.js';
import CommentsEntryPointTeaser from './CommentsEntryPointTeaser.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class CommentsEntryPointHeader extends YTNode {
    static type: string;
    header?: Text;
    comment_count?: Text;
    teaser_avatar?: Thumbnail[];
    teaser_content?: Text;
    content_renderer?: CommentsEntryPointTeaser | CommentsSimplebox | null;
    simplebox_placeholder?: Text;
    constructor(data: RawNode);
}
