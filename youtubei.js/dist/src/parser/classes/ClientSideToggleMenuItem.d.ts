import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class ClientSideToggleMenuItem extends YTNode {
    static type: string;
    text: Text;
    icon_type: string;
    toggled_text: Text;
    toggled_icon_type: string;
    is_toggled?: boolean;
    menu_item_identifier: string;
    endpoint: NavigationEndpoint;
    logging_directives?: {
        visibility: {
            types: string;
        };
        enable_displaylogger_experiment: boolean;
    };
    constructor(data: RawNode);
}
