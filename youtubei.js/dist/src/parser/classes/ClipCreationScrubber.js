import { YTNode } from '../helpers.js';
class ClipCreationScrubber extends YTNode {
    constructor(data) {
        super();
        this.length_template = data.lengthTemplate;
        this.max_length_ms = data.maxLengthMs;
        this.min_length_ms = data.minLengthMs;
        this.default_length_ms = data.defaultLengthMs;
        this.window_size_ms = data.windowSizeMs;
        this.start_label = data.startAccessibility?.accessibilityData?.label;
        this.end_label = data.endAccessibility?.accessibilityData?.label;
        this.duration_label = data.durationAccessibility?.accessibilityData?.label;
    }
}
ClipCreationScrubber.type = 'ClipCreationScrubber';
export default ClipCreationScrubber;
//# sourceMappingURL=ClipCreationScrubber.js.map