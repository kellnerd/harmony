import Button from '../Button.js';
import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import EmojiPicker from './EmojiPicker.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class CommentDialog extends YTNode {
    static type: string;
    editable_text: Text;
    author_thumbnail: Thumbnail[];
    submit_button: Button | null;
    cancel_button: Button | null;
    placeholder: Text;
    emoji_button: Button | null;
    emoji_picker: EmojiPicker | null;
    constructor(data: RawNode);
}
