import { YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
class ShowCustomThumbnail extends YTNode {
    constructor(data) {
        super();
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
    }
}
ShowCustomThumbnail.type = 'ShowCustomThumbnail';
export default ShowCustomThumbnail;
//# sourceMappingURL=ShowCustomThumbnail.js.map