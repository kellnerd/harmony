import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
class ClientSideToggleMenuItem extends YTNode {
    constructor(data) {
        super();
        this.text = new Text(data.defaultText);
        this.icon_type = data.defaultIcon.iconType;
        this.toggled_text = new Text(data.toggledText);
        this.toggled_icon_type = data.toggledIcon.iconType;
        if (Reflect.has(data, 'isToggled')) {
            this.is_toggled = data.isToggled;
        }
        this.menu_item_identifier = data.menuItemIdentifier;
        this.endpoint = new NavigationEndpoint(data.command);
        if (Reflect.has(data, 'loggingDirectives')) {
            this.logging_directives = {
                visibility: {
                    types: data.loggingDirectives.visibility.types
                },
                enable_displaylogger_experiment: data.loggingDirectives.enableDisplayloggerExperiment
            };
        }
    }
}
ClientSideToggleMenuItem.type = 'ClientSideToggleMenuItem';
export default ClientSideToggleMenuItem;
//# sourceMappingURL=ClientSideToggleMenuItem.js.map