import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class MusicDownloadStateBadge extends YTNode {
    static type: string;
    playlist_id: string;
    supported_download_states: string[];
    constructor(data: RawNode);
}
