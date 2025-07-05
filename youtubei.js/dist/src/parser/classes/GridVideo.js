import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class GridVideo extends YTNode {
    constructor(data) {
        super();
        const length_alt = data.thumbnailOverlays.find((overlay) => overlay.hasOwnProperty('thumbnailOverlayTimeStatusRenderer'))?.thumbnailOverlayTimeStatusRenderer;
        this.video_id = data.videoId;
        this.title = new Text(data.title);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.thumbnail_overlays = Parser.parseArray(data.thumbnailOverlays);
        this.rich_thumbnail = Parser.parseItem(data.richThumbnail);
        this.published = new Text(data.publishedTimeText);
        this.duration = data.lengthText ? new Text(data.lengthText) : length_alt?.text ? new Text(length_alt.text) : null;
        this.author = data.shortBylineText && new Author(data.shortBylineText, data.ownerBadges);
        this.views = new Text(data.viewCountText);
        this.short_view_count = new Text(data.shortViewCountText);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.menu = Parser.parseItem(data.menu, Menu);
        if (Reflect.has(data, 'buttons')) {
            this.buttons = Parser.parseArray(data.buttons);
        }
        if (Reflect.has(data, 'upcomingEventData')) {
            this.upcoming = new Date(Number(`${data.upcomingEventData.startTime}000`));
            this.upcoming_text = new Text(data.upcomingEventData.upcomingEventText);
            this.is_reminder_set = !!data.upcomingEventData?.isReminderSet;
        }
    }
    /**
     * @deprecated Use {@linkcode video_id} instead.
     */
    get id() {
        return this.video_id;
    }
    get is_upcoming() {
        return Boolean(this.upcoming && this.upcoming > new Date());
    }
}
GridVideo.type = 'GridVideo';
export default GridVideo;
//# sourceMappingURL=GridVideo.js.map