import { timeToSeconds } from '../../utils/Utils.js';
import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class Movie extends YTNode {
    constructor(data) {
        super();
        const overlay_time_status = data.thumbnailOverlays
            .find((overlay) => overlay.thumbnailOverlayTimeStatusRenderer)
            ?.thumbnailOverlayTimeStatusRenderer.text || 'N/A';
        this.id = data.videoId;
        this.title = new Text(data.title);
        if (Reflect.has(data, 'descriptionSnippet')) {
            this.description_snippet = new Text(data.descriptionSnippet);
        }
        this.top_metadata_items = new Text(data.topMetadataItems);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.thumbnail_overlays = Parser.parseArray(data.thumbnailOverlays);
        this.author = new Author(data.longBylineText, data.ownerBadges, data.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail);
        this.duration = {
            text: data.lengthText ? new Text(data.lengthText).toString() : new Text(overlay_time_status).toString(),
            seconds: timeToSeconds(data.lengthText ? new Text(data.lengthText).toString() : new Text(overlay_time_status).toString())
        };
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.badges = Parser.parseArray(data.badges);
        this.use_vertical_poster = data.useVerticalPoster;
        this.show_action_menu = data.showActionMenu;
        this.menu = Parser.parseItem(data.menu, Menu);
    }
}
Movie.type = 'Movie';
export default Movie;
//# sourceMappingURL=Movie.js.map