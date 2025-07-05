import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import CommentActionButtons from './comments/CommentActionButtons.js';
import Menu from './menus/Menu.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
export default class BackstagePost extends YTNode {
    static type: string;
    id: string;
    author: Author;
    content: Text;
    published: Text;
    poll_status?: string;
    vote_status?: string;
    vote_count?: Text;
    menu?: Menu | null;
    action_buttons?: CommentActionButtons | null;
    vote_button?: Button | null;
    surface: string;
    endpoint?: NavigationEndpoint;
    attachment: YTNode | undefined;
    constructor(data: RawNode);
}
