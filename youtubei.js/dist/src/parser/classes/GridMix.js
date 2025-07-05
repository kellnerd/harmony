import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class GridMix extends YTNode {
    constructor(data) {
        super();
        this.id = data.playlistId;
        this.title = new Text(data.title);
        this.author = data.shortBylineText?.simpleText ?
            new Text(data.shortBylineText) : data.longBylineText?.simpleText ?
            new Text(data.longBylineText) : null;
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.video_count = new Text(data.videoCountText);
        this.video_count_short = new Text(data.videoCountShortText);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.secondary_endpoint = new NavigationEndpoint(data.secondaryNavigationEndpoint);
        this.thumbnail_overlays = Parser.parseArray(data.thumbnailOverlays);
    }
}
GridMix.type = 'GridMix';
export default GridMix;
//# sourceMappingURL=GridMix.js.map