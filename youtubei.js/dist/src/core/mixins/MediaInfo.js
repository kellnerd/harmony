var _MediaInfo_page, _MediaInfo_actions, _MediaInfo_cpn, _MediaInfo_playback_tracking;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Constants, FormatUtils } from '../../utils/index.js';
import { InnertubeError } from '../../utils/Utils.js';
import { getStreamingInfo } from '../../utils/StreamingInfo.js';
import { Parser } from '../../parser/index.js';
import { TranscriptInfo } from '../../parser/youtube/index.js';
import ContinuationItem from '../../parser/classes/ContinuationItem.js';
import PlayerMicroformat from '../../parser/classes/PlayerMicroformat.js';
import MicroformatData from '../../parser/classes/MicroformatData.js';
class MediaInfo {
    constructor(data, actions, cpn) {
        _MediaInfo_page.set(this, void 0);
        _MediaInfo_actions.set(this, void 0);
        _MediaInfo_cpn.set(this, void 0);
        _MediaInfo_playback_tracking.set(this, void 0);
        __classPrivateFieldSet(this, _MediaInfo_actions, actions, "f");
        const info = Parser.parseResponse(data[0].data.playerResponse ? data[0].data.playerResponse : data[0].data);
        const next = data[1]?.data ? Parser.parseResponse(data[1].data) : undefined;
        __classPrivateFieldSet(this, _MediaInfo_page, [info, next], "f");
        __classPrivateFieldSet(this, _MediaInfo_cpn, cpn, "f");
        if (info.playability_status?.status === 'ERROR')
            throw new InnertubeError('This video is unavailable', info.playability_status);
        if (info.microformat && !info.microformat?.is(PlayerMicroformat, MicroformatData))
            throw new InnertubeError('Unsupported microformat', info.microformat);
        this.basic_info = {
            ...info.video_details,
            /**
             * Microformat is a bit redundant, so only
             * a few things there are interesting to us.
             */
            ...{
                embed: info.microformat?.is(PlayerMicroformat) ? info.microformat?.embed : null,
                channel: info.microformat?.is(PlayerMicroformat) ? info.microformat?.channel : null,
                is_unlisted: info.microformat?.is_unlisted,
                is_family_safe: info.microformat?.is_family_safe,
                category: info.microformat?.is(PlayerMicroformat) ? info.microformat?.category : null,
                has_ypc_metadata: info.microformat?.is(PlayerMicroformat) ? info.microformat?.has_ypc_metadata : null,
                start_timestamp: info.microformat?.is(PlayerMicroformat) ? info.microformat.start_timestamp : null,
                end_timestamp: info.microformat?.is(PlayerMicroformat) ? info.microformat.end_timestamp : null,
                view_count: info.microformat?.is(PlayerMicroformat) && isNaN(info.video_details?.view_count) ? info.microformat.view_count : info.video_details?.view_count,
                url_canonical: info.microformat?.is(MicroformatData) ? info.microformat?.url_canonical : null,
                tags: info.microformat?.is(MicroformatData) ? info.microformat?.tags : null
            },
            like_count: undefined,
            is_liked: undefined,
            is_disliked: undefined
        };
        this.annotations = info.annotations;
        this.storyboards = info.storyboards;
        this.endscreen = info.endscreen;
        this.captions = info.captions;
        this.cards = info.cards;
        this.streaming_data = info.streaming_data;
        this.playability_status = info.playability_status;
        this.player_config = info.player_config;
        __classPrivateFieldSet(this, _MediaInfo_playback_tracking, info.playback_tracking, "f");
    }
    /**
     * Generates a DASH manifest from the streaming data.
     * @param options
     * @returns DASH manifest
     */
    async toDash(options = {}) {
        const player_response = __classPrivateFieldGet(this, _MediaInfo_page, "f")[0];
        const manifest_options = options.manifest_options || {};
        if (player_response.video_details && (player_response.video_details.is_live)) {
            throw new InnertubeError('Generating DASH manifests for live videos is not supported. Please use the DASH and HLS manifests provided by YouTube in `streaming_data.dash_manifest_url` and `streaming_data.hls_manifest_url` instead.');
        }
        let storyboards;
        let captions;
        if (manifest_options.include_thumbnails && player_response.storyboards) {
            storyboards = player_response.storyboards;
        }
        if (typeof manifest_options.captions_format === 'string' && player_response.captions?.caption_tracks) {
            captions = player_response.captions.caption_tracks;
        }
        return FormatUtils.toDash(this.streaming_data, this.page[0].video_details?.is_post_live_dvr, options.url_transformer, options.format_filter, __classPrivateFieldGet(this, _MediaInfo_cpn, "f"), __classPrivateFieldGet(this, _MediaInfo_actions, "f").session.player, __classPrivateFieldGet(this, _MediaInfo_actions, "f"), storyboards, captions, manifest_options);
    }
    /**
     * Get a cleaned up representation of the adaptive_formats
     */
    getStreamingInfo(url_transformer, format_filter) {
        return getStreamingInfo(this.streaming_data, this.page[0].video_details?.is_post_live_dvr, url_transformer, format_filter, this.cpn, __classPrivateFieldGet(this, _MediaInfo_actions, "f").session.player, __classPrivateFieldGet(this, _MediaInfo_actions, "f"), __classPrivateFieldGet(this, _MediaInfo_page, "f")[0].storyboards ? __classPrivateFieldGet(this, _MediaInfo_page, "f")[0].storyboards : undefined);
    }
    /**
     * Selects the format that best matches the given options.
     * @param options - Options
     */
    chooseFormat(options) {
        return FormatUtils.chooseFormat(options, this.streaming_data);
    }
    /**
     * Downloads the video.
     * @param options - Download options.
     */
    async download(options = {}) {
        const player_response = __classPrivateFieldGet(this, _MediaInfo_page, "f")[0];
        if (player_response.video_details && (player_response.video_details.is_live || player_response.video_details.is_post_live_dvr)) {
            throw new InnertubeError('Downloading is not supported for live and Post-Live-DVR videos, as they are split up into 5 second segments that are individual files, which require using a tool such as ffmpeg to stitch them together, so they cannot be returned in a single stream.');
        }
        return FormatUtils.download(options, __classPrivateFieldGet(this, _MediaInfo_actions, "f"), this.playability_status, this.streaming_data, __classPrivateFieldGet(this, _MediaInfo_actions, "f").session.player, this.cpn);
    }
    /**
     * Retrieves the video's transcript.
     */
    async getTranscript() {
        const next_response = this.page[1];
        if (!next_response)
            throw new InnertubeError('Cannot get transcript from basic video info.');
        if (!next_response.engagement_panels)
            throw new InnertubeError('Engagement panels not found. Video likely has no transcript.');
        const transcript_panel = next_response.engagement_panels.get({
            panel_identifier: 'engagement-panel-searchable-transcript'
        });
        if (!transcript_panel)
            throw new InnertubeError('Transcript panel not found. Video likely has no transcript.');
        const transcript_continuation = transcript_panel.content?.as(ContinuationItem);
        if (!transcript_continuation)
            throw new InnertubeError('Transcript continuation not found.');
        const response = await transcript_continuation.endpoint.call(this.actions);
        return new TranscriptInfo(this.actions, response);
    }
    async addToWatchHistory(client_name, client_version, replacement = 'https://www.') {
        if (!__classPrivateFieldGet(this, _MediaInfo_playback_tracking, "f"))
            throw new InnertubeError('Playback tracking not available');
        const url_params = {
            cpn: __classPrivateFieldGet(this, _MediaInfo_cpn, "f"),
            fmt: 251,
            rtn: 0,
            rt: 0
        };
        const url = __classPrivateFieldGet(this, _MediaInfo_playback_tracking, "f").videostats_playback_url.replace('https://s.', replacement);
        return await __classPrivateFieldGet(this, _MediaInfo_actions, "f").stats(url, {
            client_name: client_name || Constants.CLIENTS.WEB.NAME,
            client_version: client_version || Constants.CLIENTS.WEB.VERSION
        }, url_params);
    }
    async updateWatchTime(startTime, client_name = Constants.CLIENTS.WEB.NAME, client_version = Constants.CLIENTS.WEB.VERSION, replacement = 'https://www.') {
        if (!__classPrivateFieldGet(this, _MediaInfo_playback_tracking, "f"))
            throw new InnertubeError('Playback tracking not available');
        const url_params = {
            cpn: __classPrivateFieldGet(this, _MediaInfo_cpn, "f"),
            st: startTime.toFixed(3),
            et: startTime.toFixed(3),
            cmt: startTime.toFixed(3),
            final: '1'
        };
        const url = __classPrivateFieldGet(this, _MediaInfo_playback_tracking, "f").videostats_watchtime_url.replace('https://s.', replacement);
        return await __classPrivateFieldGet(this, _MediaInfo_actions, "f").stats(url, {
            client_name,
            client_version
        }, url_params);
    }
    get actions() {
        return __classPrivateFieldGet(this, _MediaInfo_actions, "f");
    }
    /**
     * Content Playback Nonce.
     */
    get cpn() {
        return __classPrivateFieldGet(this, _MediaInfo_cpn, "f");
    }
    /**
     * Parsed InnerTube response.
     */
    get page() {
        return __classPrivateFieldGet(this, _MediaInfo_page, "f");
    }
}
_MediaInfo_page = new WeakMap(), _MediaInfo_actions = new WeakMap(), _MediaInfo_cpn = new WeakMap(), _MediaInfo_playback_tracking = new WeakMap();
export default MediaInfo;
//# sourceMappingURL=MediaInfo.js.map