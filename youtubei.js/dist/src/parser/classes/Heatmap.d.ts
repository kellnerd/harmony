import { type RawNode } from '../index.js';
import HeatMarker from './HeatMarker.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class Heatmap extends YTNode {
    static type: string;
    max_height_dp: number;
    min_height_dp: number;
    show_hide_animation_duration_millis: number;
    heat_markers: ObservedArray<HeatMarker>;
    heat_markers_decorations: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
