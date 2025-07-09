import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import { Thumbnail } from '../misc.js';
export default class AvatarView extends YTNode {
    static type: string;
    image: Thumbnail[];
    image_processor: {
        border_image_processor: {
            circular: boolean;
        };
    } | undefined;
    avatar_image_size: string;
    constructor(data: RawNode);
}
