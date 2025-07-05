import type Player from '../../../core/Player.js';
import type { RawNode } from '../../index.js';
export type ProjectionType = 'RECTANGULAR' | 'EQUIRECTANGULAR' | 'EQUIRECTANGULAR_THREED_TOP_BOTTOM' | 'MESH';
export type SpatialAudioType = 'AMBISONICS_5_1' | 'AMBISONICS_QUAD' | 'FOA_WITH_NON_DIEGETIC';
export type StereoLayout = 'LEFT_RIGHT' | 'TOP_BOTTOM';
export type Range = {
    start: number;
    end: number;
};
export type ColorInfo = {
    primaries?: string;
    transfer_characteristics?: string;
    matrix_coefficients?: string;
};
export type AudioTrack = {
    audio_is_default: boolean;
    display_name: string;
    id: string;
};
export type CaptionTrack = {
    display_name: string;
    vss_id: string;
    language_code: string;
    kind?: 'asr' | 'frc';
    id: string;
};
export default class Format {
    #private;
    itag: number;
    url?: string;
    width?: number;
    height?: number;
    last_modified: Date;
    last_modified_ms: string;
    content_length?: number;
    quality?: string;
    xtags?: string;
    drm_families?: string[];
    fps?: number;
    quality_label?: string;
    projection_type?: ProjectionType;
    average_bitrate?: number;
    bitrate: number;
    spatial_audio_type?: SpatialAudioType;
    target_duration_dec?: number;
    fair_play_key_uri?: string;
    stereo_layout?: StereoLayout;
    max_dvr_duration_sec?: number;
    high_replication?: boolean;
    audio_quality?: string;
    approx_duration_ms: number;
    audio_sample_rate?: number;
    audio_channels?: number;
    loudness_db?: number;
    signature_cipher?: string;
    is_drc?: boolean;
    drm_track_type?: string;
    distinct_params?: string;
    track_absolute_loudness_lkfs?: number;
    mime_type: string;
    is_type_otf: boolean;
    init_range?: Range;
    index_range?: Range;
    cipher?: string;
    audio_track?: AudioTrack;
    has_audio: boolean;
    has_video: boolean;
    has_text: boolean;
    language?: string | null;
    is_dubbed?: boolean;
    is_auto_dubbed?: boolean;
    is_descriptive?: boolean;
    is_secondary?: boolean;
    is_original?: boolean;
    color_info?: ColorInfo;
    caption_track?: CaptionTrack;
    constructor(data: RawNode, this_response_nsig_cache?: Map<string, string>);
    /**
     * Deciphers the URL using the provided player instance.
     * @param player - An optional instance of the Player class used to decipher the URL.
     * @returns The deciphered URL as a string. If no player is provided, returns the original URL or an empty string.
     */
    decipher(player?: Player): string;
}
