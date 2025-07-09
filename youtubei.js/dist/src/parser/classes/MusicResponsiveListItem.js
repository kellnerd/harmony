// TODO: Clean up and refactor this.
var _MusicResponsiveListItem_instances, _MusicResponsiveListItem_parseOther, _MusicResponsiveListItem_parseVideoOrSong, _MusicResponsiveListItem_parseSong, _MusicResponsiveListItem_parseVideo, _MusicResponsiveListItem_parseArtist, _MusicResponsiveListItem_parseLibraryArtist, _MusicResponsiveListItem_parseNonMusicTrack, _MusicResponsiveListItem_parsePodcastShow, _MusicResponsiveListItem_parseAlbum, _MusicResponsiveListItem_parsePlaylist;
import { __classPrivateFieldGet } from "tslib";
import { YTNode } from '../helpers.js';
import { isTextRun, timeToSeconds } from '../../utils/Utils.js';
import { Parser } from '../index.js';
import MusicItemThumbnailOverlay from './MusicItemThumbnailOverlay.js';
import MusicResponsiveListItemFixedColumn from './MusicResponsiveListItemFixedColumn.js';
import MusicResponsiveListItemFlexColumn from './MusicResponsiveListItemFlexColumn.js';
import MusicThumbnail from './MusicThumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
class MusicResponsiveListItem extends YTNode {
    constructor(data) {
        super();
        _MusicResponsiveListItem_instances.add(this);
        this.flex_columns = Parser.parseArray(data.flexColumns, MusicResponsiveListItemFlexColumn);
        this.fixed_columns = Parser.parseArray(data.fixedColumns, MusicResponsiveListItemFixedColumn);
        const playlist_item_data = {
            video_id: data?.playlistItemData?.videoId || null,
            playlist_set_video_id: data?.playlistItemData?.playlistSetVideoId || null
        };
        if (Reflect.has(data, 'navigationEndpoint')) {
            this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        }
        let page_type = this.endpoint?.payload?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType;
        if (!page_type) {
            const is_non_music_track = this.flex_columns.find((col) => col.title.endpoint?.payload?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === 'MUSIC_PAGE_TYPE_NON_MUSIC_AUDIO_TRACK_PAGE');
            if (is_non_music_track) {
                page_type = 'MUSIC_PAGE_TYPE_NON_MUSIC_AUDIO_TRACK_PAGE';
            }
        }
        switch (page_type) {
            case 'MUSIC_PAGE_TYPE_ALBUM':
                this.item_type = 'album';
                __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parseAlbum).call(this);
                break;
            case 'MUSIC_PAGE_TYPE_PLAYLIST':
                this.item_type = 'playlist';
                __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parsePlaylist).call(this);
                break;
            case 'MUSIC_PAGE_TYPE_ARTIST':
            case 'MUSIC_PAGE_TYPE_USER_CHANNEL':
                this.item_type = 'artist';
                __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parseArtist).call(this);
                break;
            case 'MUSIC_PAGE_TYPE_LIBRARY_ARTIST':
                this.item_type = 'library_artist';
                __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parseLibraryArtist).call(this);
                break;
            case 'MUSIC_PAGE_TYPE_NON_MUSIC_AUDIO_TRACK_PAGE':
                this.item_type = 'non_music_track';
                __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parseNonMusicTrack).call(this, playlist_item_data);
                break;
            case 'MUSIC_PAGE_TYPE_PODCAST_SHOW_DETAIL_PAGE':
                this.item_type = 'podcast_show';
                __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parsePodcastShow).call(this);
                break;
            default:
                if (this.flex_columns[1]) {
                    __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parseVideoOrSong).call(this, playlist_item_data);
                }
                else {
                    __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parseOther).call(this);
                }
        }
        if (Reflect.has(data, 'index')) {
            this.index = new Text(data.index);
        }
        if (Reflect.has(data, 'thumbnail')) {
            this.thumbnail = Parser.parseItem(data.thumbnail, MusicThumbnail);
        }
        if (Reflect.has(data, 'badges')) {
            this.badges = Parser.parseArray(data.badges);
        }
        if (Reflect.has(data, 'menu')) {
            this.menu = Parser.parseItem(data.menu, Menu);
        }
        if (Reflect.has(data, 'overlay')) {
            this.overlay = Parser.parseItem(data.overlay, MusicItemThumbnailOverlay);
        }
    }
    get thumbnails() {
        return this.thumbnail?.contents || [];
    }
}
_MusicResponsiveListItem_instances = new WeakSet(), _MusicResponsiveListItem_parseOther = function _MusicResponsiveListItem_parseOther() {
    this.title = this.flex_columns[0].title.toString();
    if (this.endpoint) {
        this.item_type = 'endpoint';
    }
    else {
        this.item_type = 'unknown';
    }
}, _MusicResponsiveListItem_parseVideoOrSong = function _MusicResponsiveListItem_parseVideoOrSong(playlist_item_data) {
    const music_video_type = this.flex_columns.at(0)?.title.runs?.at(0)?.endpoint?.payload?.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig?.musicVideoType;
    switch (music_video_type) {
        case 'MUSIC_VIDEO_TYPE_UGC':
        case 'MUSIC_VIDEO_TYPE_OMV':
            this.item_type = 'video';
            __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parseVideo).call(this, playlist_item_data);
            break;
        case 'MUSIC_VIDEO_TYPE_ATV':
            this.item_type = 'song';
            __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parseSong).call(this, playlist_item_data);
            break;
        default:
            __classPrivateFieldGet(this, _MusicResponsiveListItem_instances, "m", _MusicResponsiveListItem_parseOther).call(this);
    }
}, _MusicResponsiveListItem_parseSong = function _MusicResponsiveListItem_parseSong(playlist_item_data) {
    this.id = playlist_item_data.video_id || this.endpoint?.payload?.videoId;
    this.title = this.flex_columns[0].title.toString();
    const duration_text = this.flex_columns.at(1)?.title.runs?.find((run) => (/^\d+$/).test(run.text.replace(/:/g, '')))?.text || this.fixed_columns[0]?.title?.toString();
    if (duration_text) {
        this.duration = {
            text: duration_text,
            seconds: timeToSeconds(duration_text)
        };
    }
    const album_run = this.flex_columns.at(1)?.title.runs?.find((run) => (isTextRun(run) && run.endpoint) &&
        run.endpoint.payload.browseId.startsWith('MPR')) ||
        this.flex_columns.at(2)?.title.runs?.find((run) => (isTextRun(run) && run.endpoint) &&
            run.endpoint.payload.browseId.startsWith('MPR'));
    if (album_run && isTextRun(album_run)) {
        this.album = {
            id: album_run.endpoint?.payload?.browseId,
            name: album_run.text,
            endpoint: album_run.endpoint
        };
    }
    const artist_runs = this.flex_columns.at(1)?.title.runs?.filter((run) => (isTextRun(run) && run.endpoint) && run.endpoint.payload.browseId.startsWith('UC'));
    if (artist_runs) {
        this.artists = artist_runs.map((run) => ({
            name: run.text,
            channel_id: isTextRun(run) ? run.endpoint?.payload?.browseId : undefined,
            endpoint: isTextRun(run) ? run.endpoint : undefined
        }));
    }
}, _MusicResponsiveListItem_parseVideo = function _MusicResponsiveListItem_parseVideo(playlist_item_data) {
    this.id = playlist_item_data.video_id;
    this.title = this.flex_columns[0].title.toString();
    this.views = this.flex_columns.at(1)?.title.runs?.find((run) => run.text.match(/(.*?) views/))?.toString();
    const author_runs = this.flex_columns.at(1)?.title.runs?.filter((run) => (isTextRun(run) && run.endpoint) &&
        run.endpoint.payload.browseId.startsWith('UC'));
    if (author_runs) {
        this.authors = author_runs.map((run) => {
            return {
                name: run.text,
                channel_id: isTextRun(run) ? run.endpoint?.payload?.browseId : undefined,
                endpoint: isTextRun(run) ? run.endpoint : undefined
            };
        });
    }
    const duration_text = this.flex_columns[1].title.runs?.find((run) => (/^\d+$/).test(run.text.replace(/:/g, '')))?.text || this.fixed_columns[0]?.title.runs?.find((run) => (/^\d+$/).test(run.text.replace(/:/g, '')))?.text;
    if (duration_text) {
        this.duration = {
            text: duration_text,
            seconds: timeToSeconds(duration_text)
        };
    }
}, _MusicResponsiveListItem_parseArtist = function _MusicResponsiveListItem_parseArtist() {
    this.id = this.endpoint?.payload?.browseId;
    this.name = this.flex_columns[0].title.toString();
    this.subtitle = this.flex_columns.at(1)?.title;
    this.subscribers = this.subtitle?.runs?.find((run) => (/^(\d*\.)?\d+[M|K]? subscribers?$/i).test(run.text))?.text || '';
}, _MusicResponsiveListItem_parseLibraryArtist = function _MusicResponsiveListItem_parseLibraryArtist() {
    this.name = this.flex_columns[0].title.toString();
    this.subtitle = this.flex_columns.at(1)?.title;
    this.song_count = this.subtitle?.runs?.find((run) => (/^\d+(,\d+)? songs?$/i).test(run.text))?.text || '';
}, _MusicResponsiveListItem_parseNonMusicTrack = function _MusicResponsiveListItem_parseNonMusicTrack(playlist_item_data) {
    this.id = playlist_item_data.video_id || this.endpoint?.payload?.videoId;
    this.title = this.flex_columns[0].title.toString();
}, _MusicResponsiveListItem_parsePodcastShow = function _MusicResponsiveListItem_parsePodcastShow() {
    this.id = this.endpoint?.payload?.browseId;
    this.title = this.flex_columns[0].title.toString();
}, _MusicResponsiveListItem_parseAlbum = function _MusicResponsiveListItem_parseAlbum() {
    this.id = this.endpoint?.payload?.browseId;
    this.title = this.flex_columns[0].title.toString();
    const author_run = this.flex_columns.at(1)?.title.runs?.find((run) => (isTextRun(run) && run.endpoint) &&
        run.endpoint.payload.browseId.startsWith('UC'));
    if (author_run && isTextRun(author_run)) {
        this.author = {
            name: author_run.text,
            channel_id: author_run.endpoint?.payload?.browseId,
            endpoint: author_run.endpoint
        };
    }
    this.year = this.flex_columns.at(1)?.title.runs?.find((run) => (/^[12][0-9]{3}$/).test(run.text))?.text;
}, _MusicResponsiveListItem_parsePlaylist = function _MusicResponsiveListItem_parsePlaylist() {
    this.id = this.endpoint?.payload?.browseId;
    this.title = this.flex_columns[0].title.toString();
    const item_count_run = this.flex_columns.at(1)?.title
        .runs?.find((run) => run.text.match(/\d+ (song|songs)/));
    this.item_count = item_count_run ? item_count_run.text : undefined;
    const author_run = this.flex_columns.at(1)?.title.runs?.find((run) => (isTextRun(run) && run.endpoint) &&
        run.endpoint.payload.browseId.startsWith('UC'));
    if (author_run && isTextRun(author_run)) {
        this.author = {
            name: author_run.text,
            channel_id: author_run.endpoint?.payload?.browseId,
            endpoint: author_run.endpoint
        };
    }
};
MusicResponsiveListItem.type = 'MusicResponsiveListItem';
export default MusicResponsiveListItem;
//# sourceMappingURL=MusicResponsiveListItem.js.map