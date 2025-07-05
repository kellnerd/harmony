import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import { Text } from '../misc.js';
import MacroMarkersInfoItem from './MacroMarkersInfoItem.js';
import MacroMarkersListItem from './MacroMarkersListItem.js';
class MacroMarkersList extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents, [MacroMarkersInfoItem, MacroMarkersListItem]);
        this.sync_button_label = new Text(data.syncButtonLabel);
    }
}
MacroMarkersList.type = 'MacroMarkersList';
export default MacroMarkersList;
//# sourceMappingURL=MacroMarkersList.js.map