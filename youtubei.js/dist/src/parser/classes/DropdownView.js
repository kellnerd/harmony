import { YTNode } from '../helpers.js';
import { Text, Thumbnail } from '../misc.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class DropdownView extends YTNode {
    constructor(data) {
        super();
        this.label = new Text(data.label);
        this.placeholder_text = new Text(data.placeholderText);
        this.disabled = !!data.disabled;
        this.dropdown_type = data.type;
        this.id = data.id;
        if (Reflect.has(data, 'options')) {
            this.options = data.options.map((option) => ({
                title: new Text(option.title),
                subtitle: new Text(option.subtitle),
                leading_image: Thumbnail.fromResponse(option.leadingImage),
                value: { privacy_status_value: option.value?.privacyStatusValue },
                on_tap: new NavigationEndpoint(option.onTap),
                is_selected: !!option.isSelected
            }));
        }
    }
}
DropdownView.type = 'DropdownView';
export default DropdownView;
//# sourceMappingURL=DropdownView.js.map