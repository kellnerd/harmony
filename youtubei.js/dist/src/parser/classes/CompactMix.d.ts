import type { RawNode } from '../index.js';
import Playlist from './Playlist.js';
export default class CompactMix extends Playlist {
    static type: string;
    constructor(data: RawNode);
}
