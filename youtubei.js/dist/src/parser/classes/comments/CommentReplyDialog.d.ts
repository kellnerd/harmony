import Button from '../Button.js';
import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class CommentReplyDialog extends YTNode {
    static type: string;
    reply_button: Button | null;
    cancel_button: Button | null;
    author_thumbnail: Thumbnail[];
    placeholder: Text;
    error_message: Text;
    constructor(data: RawNode);
}
