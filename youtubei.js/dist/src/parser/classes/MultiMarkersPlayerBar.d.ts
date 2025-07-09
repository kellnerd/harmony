import { YTNode, type ObservedArray } from '../helpers.js';
import type { RawNode } from '../index.js';
import Chapter from './Chapter.js';
import Heatmap from './Heatmap.js';
export declare class Marker extends YTNode {
    static type: string;
    marker_key: string;
    value: {
        heatmap?: Heatmap | null;
        chapters?: Chapter[];
    };
    constructor(data: RawNode);
}
export default class MultiMarkersPlayerBar extends YTNode {
    static type: string;
    markers_map: ObservedArray<Marker>;
    constructor(data: RawNode);
}
