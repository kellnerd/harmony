import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class PlaylistThumbnailOverlay extends YTNode {
    static type: string;
    icon_type?: string;
    text: Text;
    constructor(data: RawNode);
}
