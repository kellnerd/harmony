import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class PlaylistMetadata extends YTNode {
    static type: string;
    title: string;
    description: string;
    constructor(data: RawNode);
}
