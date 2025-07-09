import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class MusicVisualHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.thumbnail = data.thumbnail ? Thumbnail.fromResponse(data.thumbnail.musicThumbnailRenderer?.thumbnail) : [];
        this.menu = Parser.parseItem(data.menu, Menu);
        this.foreground_thumbnail = data.foregroundThumbnail ? Thumbnail.fromResponse(data.foregroundThumbnail.musicThumbnailRenderer?.thumbnail) : [];
    }
}
MusicVisualHeader.type = 'MusicVisualHeader';
export default MusicVisualHeader;
//# sourceMappingURL=MusicVisualHeader.js.map