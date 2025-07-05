import type Player from '../core/Player.js';
import type Actions from '../core/Actions.js';
import type Format from '../parser/classes/misc/Format.js';
import type { IPlayabilityStatus, IStreamingData } from '../parser/index.js';
import type { DownloadOptions, FormatOptions } from '../types/index.js';
export declare function download(options: DownloadOptions, actions: Actions, playability_status?: IPlayabilityStatus, streaming_data?: IStreamingData, player?: Player, cpn?: string): Promise<ReadableStream<Uint8Array>>;
/**
 * Selects the format that best matches the given options.
 * @param options - Options
 * @param streaming_data - Streaming data
 */
export declare function chooseFormat(options: FormatOptions, streaming_data?: IStreamingData): Format;
export { toDash } from './DashManifest.js';
