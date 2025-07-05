import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class ThumbnailOverlayLoadingPreview extends YTNode {
    static type: string;
    text: Text;
    constructor(data: RawNode);
}
