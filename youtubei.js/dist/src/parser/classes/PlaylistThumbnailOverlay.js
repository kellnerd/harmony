import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class PlaylistThumbnailOverlay extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'icon'))
            this.icon_type = data.icon.iconType;
        this.text = new Text(data.text);
    }
}
PlaylistThumbnailOverlay.type = 'PlaylistThumbnailOverlay';
export default PlaylistThumbnailOverlay;
//# sourceMappingURL=PlaylistThumbnailOverlay.js.map