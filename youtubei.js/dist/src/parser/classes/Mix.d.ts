import type { RawNode } from '../index.js';
import Playlist from './Playlist.js';
export default class Mix extends Playlist {
    static type: string;
    constructor(data: RawNode);
}
