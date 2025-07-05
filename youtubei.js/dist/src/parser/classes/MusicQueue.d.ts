import { type RawNode } from '../index.js';
import PlaylistPanel from './PlaylistPanel.js';
import { YTNode } from '../helpers.js';
export default class MusicQueue extends YTNode {
    static type: string;
    content: PlaylistPanel | null;
    constructor(data: RawNode);
}
