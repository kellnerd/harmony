import { YTNode } from '../helpers.js';
class HeatMarker extends YTNode {
    constructor(data) {
        super();
        this.time_range_start_millis = Number.parseInt(data.startMillis, 10);
        this.marker_duration_millis = Number.parseInt(data.durationMillis, 10);
        this.heat_marker_intensity_score_normalized = data.intensityScoreNormalized;
    }
}
HeatMarker.type = 'HeatMarker';
export default HeatMarker;
//# sourceMappingURL=HeatMarker.js.map