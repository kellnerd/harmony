import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class InfoRow extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        if (Reflect.has(data, 'defaultMetadata')) {
            this.default_metadata = new Text(data.defaultMetadata);
        }
        if (Reflect.has(data, 'expandedMetadata')) {
            this.expanded_metadata = new Text(data.expandedMetadata);
        }
        if (Reflect.has(data, 'infoRowExpandStatusKey')) {
            this.info_row_expand_status_key = data.infoRowExpandStatusKey;
        }
    }
}
InfoRow.type = 'InfoRow';
export default InfoRow;
//# sourceMappingURL=InfoRow.js.map