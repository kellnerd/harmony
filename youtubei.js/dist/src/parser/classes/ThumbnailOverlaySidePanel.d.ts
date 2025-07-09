import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ThumbnailOverlaySidePanel extends YTNode {
    static type: string;
    text: Text;
    icon_type: string;
    constructor(data: RawNode);
}
