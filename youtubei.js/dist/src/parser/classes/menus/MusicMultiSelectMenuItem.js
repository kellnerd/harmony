import { YTNode } from '../../helpers.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
import Text from '../misc/Text.js';
class MusicMultiSelectMenuItem extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title).toString();
        this.form_item_entity_key = data.formItemEntityKey;
        if (Reflect.has(data, 'selectedIcon')) {
            this.selected_icon_type = data.selectedIcon.iconType;
        }
        // @TODO: Check if there any other endpoints we can parse.
        if (Reflect.has(data, 'selectedCommand')) {
            this.endpoint = new NavigationEndpoint(data.selectedCommand);
        }
        this.selected = !!this.endpoint;
    }
}
MusicMultiSelectMenuItem.type = 'MusicMultiSelectMenuItem';
export default MusicMultiSelectMenuItem;
//# sourceMappingURL=MusicMultiSelectMenuItem.js.map