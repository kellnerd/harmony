import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class AudioOnlyPlayability extends YTNode {
    static type: string;
    audio_only_availability: string;
    constructor(data: RawNode);
}
