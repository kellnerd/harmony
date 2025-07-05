import { type RawNode } from '../index.js';
import MusicPlayButton from './MusicPlayButton.js';
import { YTNode } from '../helpers.js';
export default class MusicItemThumbnailOverlay extends YTNode {
    static type: string;
    content: MusicPlayButton | null;
    content_position: string;
    display_style: string;
    constructor(data: RawNode);
}
