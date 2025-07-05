import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class DropdownItem extends YTNode {
    constructor(data) {
        super();
        this.label = new Text(data.label).toString();
        this.selected = !!data.isSelected;
        if (Reflect.has(data, 'int32Value')) {
            this.value = data.int32Value;
        }
        else if (data.stringValue) {
            this.value = data.stringValue;
        }
        if (Reflect.has(data, 'onSelectCommand')) {
            this.endpoint = new NavigationEndpoint(data.onSelectCommand);
        }
        if (Reflect.has(data, 'icon')) {
            this.icon_type = data.icon?.iconType;
        }
        if (Reflect.has(data, 'descriptionText')) {
            this.description = new Text(data.descriptionText);
        }
    }
}
DropdownItem.type = 'DropdownItem';
export default DropdownItem;
//# sourceMappingURL=DropdownItem.js.map