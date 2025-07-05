import PlayerStoryboardSpec from '../parser/classes/PlayerStoryboardSpec.js';
import type Actions from '../core/Actions.js';
import type Player from '../core/Player.js';
import type { IStreamingData } from '../parser/index.js';
import type { PlayerLiveStoryboardSpec } from '../parser/nodes.js';
import type { FormatFilter, URLTransformer } from '../types/index.js';
import type { StreamingInfoOptions } from '../types/StreamingInfoOptions.js';
import type { CaptionTrackData } from '../parser/classes/PlayerCaptionsTracklist.js';
export interface StreamingInfo {
    getDuration(): Promise<number>;
    audio_sets: AudioSet[];
    video_sets: VideoSet[];
    image_sets: ImageSet[];
    text_sets: TextSet[];
}
export interface AudioSet {
    mime_type: string;
    language?: string;
    codecs?: string;
    audio_sample_rate?: number;
    track_name?: string;
    track_roles?: ('main' | 'dub' | 'description' | 'enhanced-audio-intelligibility' | 'alternate')[];
    channels?: number;
    representations: AudioRepresentation[];
}
export interface Range {
    start: number;
    end: number;
}
export type SegmentInfo = {
    is_oft: false;
    is_post_live_dvr: false;
    base_url: string;
    index_range: Range;
    init_range: Range;
} | {
    is_oft: true;
    is_post_live_dvr: false;
    getSegmentTemplate(): Promise<SegmentTemplate>;
} | {
    is_oft: false;
    is_post_live_dvr: true;
    getSegmentTemplate(): Promise<SegmentTemplate>;
};
export interface Segment {
    duration: number;
    repeat_count?: number;
}
export interface SegmentTemplate {
    init_url?: string;
    media_url: string;
    timeline: Segment[];
}
export interface AudioRepresentation {
    uid: string;
    bitrate: number;
    codecs?: string;
    audio_sample_rate?: number;
    channels?: number;
    segment_info: SegmentInfo;
}
export interface VideoSet {
    mime_type: string;
    color_info: ColorInfo;
    codecs?: string;
    fps?: number;
    representations: VideoRepresentation[];
}
export interface VideoRepresentation {
    uid: string;
    bitrate: number;
    width?: number;
    height?: number;
    fps?: number;
    codecs?: string;
    segment_info: SegmentInfo;
}
export interface ColorInfo {
    primaries?: '1' | '9';
    transfer_characteristics?: '1' | '14' | '16' | '18';
    matrix_coefficients?: '1' | '14';
}
export interface ImageSet {
    probable_mime_type: string;
    /**
     * Sometimes YouTube returns webp instead of jpg despite the file extension being jpg
     * So we need to update the mime type to reflect the actual mime type of the response
     */
    getMimeType(): Promise<string>;
    representations: ImageRepresentation[];
}
export interface ImageRepresentation {
    uid: string;
    getBitrate(): Promise<number>;
    sheet_width: number;
    sheet_height: number;
    thumbnail_width: number;
    thumbnail_height: number;
    rows: number;
    columns: number;
    template_url: string;
    template_duration: number;
    getURL(n: number): string;
}
export interface TextSet {
    mime_type: string;
    language: string;
    track_name: string;
    track_roles: ('caption' | 'dub')[];
    representation: TextRepresentation;
}
export interface TextRepresentation {
    uid: string;
    base_url: string;
}
export declare function getStreamingInfo(streaming_data?: IStreamingData, is_post_live_dvr?: boolean, url_transformer?: URLTransformer, format_filter?: FormatFilter, cpn?: string, player?: Player, actions?: Actions, storyboards?: PlayerStoryboardSpec | PlayerLiveStoryboardSpec, caption_tracks?: CaptionTrackData[], options?: StreamingInfoOptions): StreamingInfo;
