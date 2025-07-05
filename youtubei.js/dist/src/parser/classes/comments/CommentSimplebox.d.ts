import Button from '../Button.js';
import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class CommentSimplebox extends YTNode {
    static type: string;
    submit_button: Button | null;
    cancel_button: Button | null;
    author_thumbnail: Thumbnail[];
    placeholder: Text;
    avatar_size: string;
    constructor(data: RawNode);
}
