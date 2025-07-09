import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export interface CaptionTrackData {
    base_url: string;
    name: Text;
    vss_id: string;
    language_code: string;
    kind?: 'asr' | 'frc';
    is_translatable: boolean;
}
export default class PlayerCaptionsTracklist extends YTNode {
    static type: string;
    caption_tracks?: CaptionTrackData[];
    audio_tracks?: {
        audio_track_id: string;
        captions_initial_state: string;
        default_caption_track_index?: number;
        has_default_track: boolean;
        visibility: string;
        caption_track_indices: number[];
    }[];
    default_audio_track_index?: number;
    translation_languages?: {
        language_code: string;
        language_name: Text;
    }[];
    constructor(data: RawNode);
}
