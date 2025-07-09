import { YTNode } from '../../helpers.js';
import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import type { RawNode } from '../../index.js';
export default class CommentsSimplebox extends YTNode {
    static type: string;
    simplebox_avatar: Thumbnail[];
    simplebox_placeholder: Text;
    constructor(data: RawNode);
}
