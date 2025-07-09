import { YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
class MovingThumbnail extends YTNode {
    constructor(data) {
        super();
        return data.movingThumbnailDetails?.thumbnails.map((thumbnail) => new Thumbnail(thumbnail)).sort((a, b) => b.width - a.width);
    }
}
MovingThumbnail.type = 'MovingThumbnail';
export default MovingThumbnail;
//# sourceMappingURL=MovingThumbnail.js.map