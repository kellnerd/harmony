import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
class MusicEditablePlaylistDetailHeader extends YTNode {
    constructor(data) {
        super();
        this.header = Parser.parseItem(data.header);
        this.edit_header = Parser.parseItem(data.editHeader);
        this.playlist_id = data.playlistId;
    }
}
MusicEditablePlaylistDetailHeader.type = 'MusicEditablePlaylistDetailHeader';
export default MusicEditablePlaylistDetailHeader;
//# sourceMappingURL=MusicEditablePlaylistDetailHeader.js.map