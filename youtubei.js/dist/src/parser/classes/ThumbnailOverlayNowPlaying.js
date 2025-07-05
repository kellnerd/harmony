import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class ThumbnailOverlayNowPlaying extends YTNode {
    constructor(data) {
        super();
        this.text = new Text(data.text).toString();
    }
}
ThumbnailOverlayNowPlaying.type = 'ThumbnailOverlayNowPlaying';
export default ThumbnailOverlayNowPlaying;
//# sourceMappingURL=ThumbnailOverlayNowPlaying.js.map