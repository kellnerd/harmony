import Text from '../misc/Text.js';
import { YTNode } from '../../helpers.js';
import Button from '../Button.js';
import { Parser } from '../../index.js';
import KidsBlocklistPickerItem from './KidsBlocklistPickerItem.js';
class KidsBlocklistPicker extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.child_rows = Parser.parse(data.childRows, true, [KidsBlocklistPickerItem]);
        this.done_button = Parser.parseItem(data.doneButton, [Button]);
        this.successful_toast_action_message = new Text(data.successfulToastActionMessage);
    }
}
KidsBlocklistPicker.type = 'KidsBlocklistPicker';
export default KidsBlocklistPicker;
//# sourceMappingURL=KidsBlocklistPicker.js.map