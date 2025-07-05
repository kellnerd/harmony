import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class PlayerErrorMessage extends YTNode {
    static type: string;
    subreason: Text;
    reason: Text;
    proceed_button: Button | null;
    thumbnails: Thumbnail[];
    icon_type?: string;
    constructor(data: RawNode);
}
