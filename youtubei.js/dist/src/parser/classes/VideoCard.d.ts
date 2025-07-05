import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
import Video from './Video.js';
export default class VideoCard extends Video {
    static type: string;
    metadata_text?: Text;
    byline_text?: Text;
    constructor(data: RawNode);
}
