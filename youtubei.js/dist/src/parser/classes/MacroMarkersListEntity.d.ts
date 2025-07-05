import { YTNode, type ObservedArray } from '../helpers.js';
import type { RawNode } from '../index.js';
import HeatMarker from './HeatMarker.js';
import TimedMarkerDecoration from './TimedMarkerDecoration.js';
import Heatmap from './Heatmap.js';
/**
 * Represents a list of markers for a video. Can contain different types of markers:
 * - MARKER_TYPE_HEATMAP: Heat map markers showing audience engagement data
 * - Other marker types may exist but are not currently handled
 */
export default class MacroMarkersListEntity extends YTNode {
    static type: string;
    marker_entity_key: string;
    external_video_id: string;
    /** The type of markers in this entity (e.g., 'MARKER_TYPE_HEATMAP') */
    marker_type: string;
    markers: ObservedArray<HeatMarker>;
    max_height_dp: number;
    min_height_dp: number;
    show_hide_animation_duration_millis: number;
    timed_marker_decorations: ObservedArray<TimedMarkerDecoration>;
    private raw_api_markers;
    private raw_api_decorations;
    constructor(data: RawNode);
    /**
    * Checks if this MacroMarkersListEntity represents heatmap data.
    * Only heatmap markers can be converted to Heatmap objects.
    */
    isHeatmap(): boolean;
    /**
    * Converts this MacroMarkersListEntity to a Heatmap object
    * for compatibility with existing code. Only works for heatmap markers.
    * @returns Heatmap object if this entity contains heatmap data, null otherwise
    */
    toHeatmap(): Heatmap | null;
}
