import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import PlaylistCustomThumbnail from './PlaylistCustomThumbnail.js';
import PlaylistVideoThumbnail from './PlaylistVideoThumbnail.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class Playlist extends YTNode {
    constructor(data) {
        super();
        this.id = data.playlistId;
        this.title = new Text(data.title);
        this.author = data.shortBylineText?.simpleText ?
            new Text(data.shortBylineText) :
            new Author(data.longBylineText, data.ownerBadges, null);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail || { thumbnails: data.thumbnails.map((th) => th.thumbnails).flat(1) });
        this.video_count = new Text(data.thumbnailText);
        this.video_count_short = new Text(data.videoCountShortText);
        this.first_videos = Parser.parseArray(data.videos);
        this.share_url = data.shareUrl || null;
        this.menu = Parser.parseItem(data.menu);
        this.badges = Parser.parseArray(data.ownerBadges);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.thumbnail_overlays = Parser.parseArray(data.thumbnailOverlays);
        if (Reflect.has(data, 'thumbnailRenderer')) {
            this.thumbnail_renderer = Parser.parseItem(data.thumbnailRenderer, [PlaylistVideoThumbnail, PlaylistCustomThumbnail]) || undefined;
        }
        if (Reflect.has(data, 'viewPlaylistText')) {
            this.view_playlist = new Text(data.viewPlaylistText);
        }
    }
}
Playlist.type = 'Playlist';
export default Playlist;
//# sourceMappingURL=Playlist.js.map