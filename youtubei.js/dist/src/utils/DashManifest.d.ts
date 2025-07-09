import type Actions from '../core/Actions.js';
import type Player from '../core/Player.js';
import type { IStreamingData } from '../parser/index.js';
import type { PlayerStoryboardSpec } from '../parser/nodes.js';
import type { FormatFilter, URLTransformer } from '../types/index.js';
import type PlayerLiveStoryboardSpec from '../parser/classes/PlayerLiveStoryboardSpec.js';
import type { StreamingInfoOptions } from '../types/StreamingInfoOptions.js';
import type { CaptionTrackData } from '../parser/classes/PlayerCaptionsTracklist.js';
export declare function toDash(streaming_data?: IStreamingData, is_post_live_dvr?: boolean, url_transformer?: URLTransformer, format_filter?: FormatFilter, cpn?: string, player?: Player, actions?: Actions, storyboards?: PlayerStoryboardSpec | PlayerLiveStoryboardSpec, caption_tracks?: CaptionTrackData[], options?: StreamingInfoOptions): Promise<string>;
