import type { RawNode } from '../../index.js';
import AddToPlaylistServiceEndpoint from './AddToPlaylistServiceEndpoint.js';
export default class AddToPlaylistEndpoint extends AddToPlaylistServiceEndpoint {
    static type: string;
    constructor(data: RawNode);
}
