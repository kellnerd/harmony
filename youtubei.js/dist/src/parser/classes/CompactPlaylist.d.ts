import type { RawNode } from '../index.js';
import Playlist from './Playlist.js';
declare class CompactPlaylist extends Playlist {
    static type: string;
    constructor(data: RawNode);
}
export default CompactPlaylist;
