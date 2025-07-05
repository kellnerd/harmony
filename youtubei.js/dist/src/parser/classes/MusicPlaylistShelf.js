import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import MusicResponsiveListItem from './MusicResponsiveListItem.js';
import ContinuationItem from './ContinuationItem.js';
class MusicPlaylistShelf extends YTNode {
    constructor(data) {
        super();
        this.playlist_id = data.playlistId;
        this.contents = Parser.parseArray(data.contents, [MusicResponsiveListItem, ContinuationItem]);
        this.collapsed_item_count = data.collapsedItemCount;
        this.continuation = data.continuations?.[0]?.nextContinuationData?.continuation || null;
    }
}
MusicPlaylistShelf.type = 'MusicPlaylistShelf';
export default MusicPlaylistShelf;
//# sourceMappingURL=MusicPlaylistShelf.js.map