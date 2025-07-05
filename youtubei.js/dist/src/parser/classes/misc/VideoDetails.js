import Thumbnail from './Thumbnail.js';
export default class VideoDetails {
    constructor(data) {
        this.id = data.videoId;
        this.channel_id = data.channelId;
        this.title = data.title;
        this.duration = parseInt(data.lengthSeconds);
        this.keywords = data.keywords;
        this.is_owner_viewing = !!data.isOwnerViewing;
        this.short_description = data.shortDescription;
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
        this.allow_ratings = !!data.allowRatings;
        this.view_count = parseInt(data.viewCount);
        this.author = data.author;
        this.is_private = !!data.isPrivate;
        this.is_live = !!data.isLive;
        this.is_live_content = !!data.isLiveContent;
        this.is_live_dvr_enabled = !!data.isLiveDvrEnabled;
        this.is_low_latency_live_stream = !!data.isLowLatencyLiveStream;
        this.is_upcoming = !!data.isUpcoming;
        this.is_post_live_dvr = !!data.isPostLiveDvr;
        this.is_crawlable = !!data.isCrawlable;
        this.live_chunk_readahead = data.liveChunkReadahead;
    }
}
//# sourceMappingURL=VideoDetails.js.map