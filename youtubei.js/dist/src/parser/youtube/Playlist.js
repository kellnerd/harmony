var _Playlist_instances, _Playlist_getStat;
import { __classPrivateFieldGet } from "tslib";
import { InnertubeError } from '../../utils/Utils.js';
import Feed from '../../core/mixins/Feed.js';
import Message from '../classes/Message.js';
import PlaylistCustomThumbnail from '../classes/PlaylistCustomThumbnail.js';
import PlaylistHeader from '../classes/PlaylistHeader.js';
import PlaylistMetadata from '../classes/PlaylistMetadata.js';
import PlaylistSidebarPrimaryInfo from '../classes/PlaylistSidebarPrimaryInfo.js';
import PlaylistSidebarSecondaryInfo from '../classes/PlaylistSidebarSecondaryInfo.js';
import PlaylistVideoList from '../classes/PlaylistVideoList.js';
import PlaylistVideoThumbnail from '../classes/PlaylistVideoThumbnail.js';
import ReelItem from '../classes/ReelItem.js';
import ShortsLockupView from '../classes/ShortsLockupView.js';
import VideoOwner from '../classes/VideoOwner.js';
import Alert from '../classes/Alert.js';
import ContinuationItem from '../classes/ContinuationItem.js';
import PlaylistVideo from '../classes/PlaylistVideo.js';
import SectionList from '../classes/SectionList.js';
import { observe } from '../helpers.js';
class Playlist extends Feed {
    constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
        _Playlist_instances.add(this);
        const header = this.memo.getType(PlaylistHeader)[0];
        const primary_info = this.memo.getType(PlaylistSidebarPrimaryInfo)[0];
        const secondary_info = this.memo.getType(PlaylistSidebarSecondaryInfo)[0];
        const video_list = this.memo.getType(PlaylistVideoList)[0];
        const alert = this.page.alerts?.firstOfType(Alert);
        if (alert && alert.alert_type === 'ERROR')
            throw new InnertubeError(alert.text.toString(), alert);
        if (!primary_info && !secondary_info && Object.keys(this.page).length === 0)
            throw new InnertubeError('Got empty continuation response. This is likely the end of the playlist.');
        this.info = {
            ...this.page.metadata?.item().as(PlaylistMetadata),
            ...{
                subtitle: header ? header.subtitle : null,
                author: secondary_info?.owner?.as(VideoOwner).author ?? header?.author,
                thumbnails: primary_info?.thumbnail_renderer?.as(PlaylistVideoThumbnail, PlaylistCustomThumbnail).thumbnail,
                total_items: __classPrivateFieldGet(this, _Playlist_instances, "m", _Playlist_getStat).call(this, 0, primary_info),
                views: __classPrivateFieldGet(this, _Playlist_instances, "m", _Playlist_getStat).call(this, 1, primary_info),
                last_updated: __classPrivateFieldGet(this, _Playlist_instances, "m", _Playlist_getStat).call(this, 2, primary_info),
                can_share: header?.can_share,
                can_delete: header?.can_delete,
                can_reorder: video_list?.can_reorder,
                is_editable: video_list?.is_editable,
                privacy: header?.privacy
            }
        };
        this.menu = primary_info?.menu;
        this.endpoint = primary_info?.endpoint;
        this.messages = this.memo.getType(Message);
    }
    get items() {
        return observe(this.videos.as(PlaylistVideo, ReelItem, ShortsLockupView).filter((video) => video.style !== 'PLAYLIST_VIDEO_RENDERER_STYLE_RECOMMENDED_VIDEO'));
    }
    get has_continuation() {
        const section_list = this.memo.getType(SectionList)[0];
        if (!section_list)
            return super.has_continuation;
        return !!this.memo.getType(ContinuationItem).find((node) => !section_list.contents.includes(node));
    }
    async getContinuationData() {
        const section_list = this.memo.getType(SectionList)[0];
        /**
         * No section list means there can't be additional continuation nodes here,
         * so no need to check.
         */
        if (!section_list)
            return await super.getContinuationData();
        const playlist_contents_continuation = this.memo.getType(ContinuationItem)
            .find((node) => !section_list.contents.includes(node));
        if (!playlist_contents_continuation)
            throw new InnertubeError('There are no continuations.');
        return await playlist_contents_continuation.endpoint.call(this.actions, { parse: true });
    }
    async getContinuation() {
        const page = await this.getContinuationData();
        if (!page)
            throw new InnertubeError('Could not get continuation data');
        return new Playlist(this.actions, page, true);
    }
}
_Playlist_instances = new WeakSet(), _Playlist_getStat = function _Playlist_getStat(index, primary_info) {
    if (!primary_info || !primary_info.stats)
        return 'N/A';
    return primary_info.stats[index]?.toString() || 'N/A';
};
export default Playlist;
//# sourceMappingURL=Playlist.js.map