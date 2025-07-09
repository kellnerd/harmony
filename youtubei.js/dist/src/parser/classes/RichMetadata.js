import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
class RichMetadata extends YTNode {
    constructor(data) {
        super();
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
        this.title = new Text(data.title);
        this.subtitle = new Text(data.subtitle);
        this.call_to_action = new Text(data.callToAction);
        if (Reflect.has(data, 'callToActionIcon')) {
            this.icon_type = data.callToActionIcon.iconType;
        }
        this.endpoint = new NavigationEndpoint(data.endpoint);
    }
}
RichMetadata.type = 'RichMetadata';
export default RichMetadata;
//# sourceMappingURL=RichMetadata.js.map