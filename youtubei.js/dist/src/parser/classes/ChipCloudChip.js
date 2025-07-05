import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
class ChipCloudChip extends YTNode {
    constructor(data) {
        super();
        this.is_selected = data.isSelected;
        if (Reflect.has(data, 'navigationEndpoint')) {
            this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        }
        this.text = new Text(data.text).toString();
    }
}
ChipCloudChip.type = 'ChipCloudChip';
export default ChipCloudChip;
//# sourceMappingURL=ChipCloudChip.js.map