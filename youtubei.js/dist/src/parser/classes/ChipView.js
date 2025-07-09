import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class ChipView extends YTNode {
    constructor(data) {
        super();
        this.text = data.text;
        this.display_type = data.displayType;
        this.endpoint = new NavigationEndpoint(data.tapCommand);
        this.chip_entity_key = data.chipEntityKey;
    }
}
ChipView.type = 'ChipView';
export default ChipView;
//# sourceMappingURL=ChipView.js.map