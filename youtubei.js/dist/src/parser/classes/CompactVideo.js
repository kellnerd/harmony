import { timeToSeconds } from '../../utils/Utils.js';
import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Menu from './menus/Menu.js';
import MetadataBadge from './MetadataBadge.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import ThumbnailOverlayTimeStatus from './ThumbnailOverlayTimeStatus.js';
class CompactVideo extends YTNode {
    constructor(data) {
        super();
        this.video_id = data.videoId;
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.title = new Text(data.title);
        this.author = new Author(data.longBylineText, data.ownerBadges, data.channelThumbnail);
        this.is_watched = !!data.isWatched;
        this.thumbnail_overlays = Parser.parseArray(data.thumbnailOverlays);
        this.menu = Parser.parseItem(data.menu, Menu);
        this.badges = Parser.parseArray(data.badges, MetadataBadge);
        if ('publishedTimeText' in data)
            this.published = new Text(data.publishedTimeText);
        if ('shortBylineText' in data)
            this.view_count = new Text(data.viewCountText);
        if ('shortViewCountText' in data)
            this.short_view_count = new Text(data.shortViewCountText);
        if ('richThumbnail' in data)
            this.rich_thumbnail = Parser.parseItem(data.richThumbnail);
        if ('shortBylineText' in data)
            this.short_byline_text = new Text(data.shortBylineText);
        if ('longBylineText' in data)
            this.long_byline_text = new Text(data.longBylineText);
        if ('lengthText' in data)
            this.length_text = new Text(data.lengthText);
        if ('serviceEndpoints' in data)
            this.service_endpoints = data.serviceEndpoints.map((endpoint) => new NavigationEndpoint(endpoint));
        if ('serviceEndpoint' in data)
            this.service_endpoint = new NavigationEndpoint(data.serviceEndpoint);
        if ('navigationEndpoint' in data)
            this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        if ('style' in data)
            this.style = data.style;
    }
    /**
     * @deprecated Use {@linkcode video_id} instead.
     */
    get id() {
        return this.video_id;
    }
    get duration() {
        const overlay_time_status = this.thumbnail_overlays.firstOfType(ThumbnailOverlayTimeStatus);
        const length_text = this.length_text?.toString() || overlay_time_status?.text.toString();
        return {
            text: length_text,
            seconds: length_text ? timeToSeconds(length_text) : 0
        };
    }
    get best_thumbnail() {
        return this.thumbnails[0];
    }
    get is_fundraiser() {
        return this.badges.some((badge) => badge.label === 'Fundraiser');
    }
    get is_live() {
        return this.badges.some((badge) => {
            if (badge.style === 'BADGE_STYLE_TYPE_LIVE_NOW' || badge.label === 'LIVE')
                return true;
        });
    }
    get is_new() {
        return this.badges.some((badge) => badge.label === 'New');
    }
    get is_premiere() {
        return this.badges.some((badge) => badge.style === 'PREMIERE');
    }
}
CompactVideo.type = 'CompactVideo';
export default CompactVideo;
//# sourceMappingURL=CompactVideo.js.map