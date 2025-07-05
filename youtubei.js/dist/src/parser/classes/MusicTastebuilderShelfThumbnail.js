import { YTNode } from '../helpers.js';
import { Thumbnail } from '../misc.js';
class MusicTastebuilderShelfThumbnail extends YTNode {
    constructor(data) {
        super();
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
    }
}
MusicTastebuilderShelfThumbnail.type = 'MusicTastebuilderShelfThumbnail';
export default MusicTastebuilderShelfThumbnail;
//# sourceMappingURL=MusicTastebuilderShelfThumbnail.js.map