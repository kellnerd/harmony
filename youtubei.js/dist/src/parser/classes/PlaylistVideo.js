import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import ThumbnailOverlayTimeStatus from './ThumbnailOverlayTimeStatus.js';
import Menu from './menus/Menu.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class PlaylistVideo extends YTNode {
    constructor(data) {
        super();
        this.id = data.videoId;
        this.index = new Text(data.index);
        this.title = new Text(data.title);
        this.author = new Author(data.shortBylineText);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.thumbnail_overlays = Parser.parseArray(data.thumbnailOverlays);
        this.set_video_id = data?.setVideoId;
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.is_playable = data.isPlayable;
        this.menu = Parser.parseItem(data.menu, Menu);
        this.video_info = new Text(data.videoInfo);
        this.accessibility_label = data.title.accessibility.accessibilityData.label;
        if (Reflect.has(data, 'style')) {
            this.style = data.style;
        }
        const upcoming = data.upcomingEventData && Number(`${data.upcomingEventData.startTime}000`);
        if (upcoming) {
            this.upcoming = new Date(upcoming);
        }
        this.duration = {
            text: new Text(data.lengthText).toString(),
            seconds: parseInt(data.lengthSeconds)
        };
    }
    get is_live() {
        return this.thumbnail_overlays.firstOfType(ThumbnailOverlayTimeStatus)?.style === 'LIVE';
    }
    get is_upcoming() {
        return this.thumbnail_overlays.firstOfType(ThumbnailOverlayTimeStatus)?.style === 'UPCOMING';
    }
}
PlaylistVideo.type = 'PlaylistVideo';
export default PlaylistVideo;
//# sourceMappingURL=PlaylistVideo.js.map