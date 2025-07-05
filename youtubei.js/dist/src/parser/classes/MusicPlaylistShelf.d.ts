import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import MusicResponsiveListItem from './MusicResponsiveListItem.js';
import ContinuationItem from './ContinuationItem.js';
export default class MusicPlaylistShelf extends YTNode {
    static type: string;
    playlist_id: string;
    contents: ObservedArray<MusicResponsiveListItem | ContinuationItem>;
    collapsed_item_count: number;
    continuation: string | null;
    constructor(data: RawNode);
}
