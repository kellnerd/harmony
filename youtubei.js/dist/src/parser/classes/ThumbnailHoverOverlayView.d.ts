import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class ThumbnailHoverOverlayView extends YTNode {
    static type: string;
    icon_name: string;
    text: Text;
    style: string;
    constructor(data: RawNode);
}
