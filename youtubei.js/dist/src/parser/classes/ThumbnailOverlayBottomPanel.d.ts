import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class ThumbnailOverlayBottomPanel extends YTNode {
    static type: string;
    text?: Text;
    icon_type?: string;
    constructor(data: RawNode);
}
