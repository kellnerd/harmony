import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import MetadataBadge from './MetadataBadge.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class GridMovie extends YTNode {
    constructor(data) {
        super();
        const length_alt = data.thumbnailOverlays.find((overlay) => overlay.hasOwnProperty('thumbnailOverlayTimeStatusRenderer'))?.thumbnailOverlayTimeStatusRenderer;
        this.id = data.videoId;
        this.title = new Text(data.title);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.duration = data.lengthText ? new Text(data.lengthText) : length_alt?.text ? new Text(length_alt.text) : null;
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.badges = Parser.parseArray(data.badges, MetadataBadge);
        this.metadata = new Text(data.metadata);
        this.thumbnail_overlays = Parser.parseArray(data.thumbnailOverlays);
    }
}
GridMovie.type = 'GridMovie';
export default GridMovie;
//# sourceMappingURL=GridMovie.js.map