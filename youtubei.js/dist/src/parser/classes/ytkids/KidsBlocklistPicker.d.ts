import Text from '../misc/Text.js';
import { YTNode } from '../../helpers.js';
import Button from '../Button.js';
import { type RawNode } from '../../index.js';
import KidsBlocklistPickerItem from './KidsBlocklistPickerItem.js';
export default class KidsBlocklistPicker extends YTNode {
    static type: string;
    title: Text;
    child_rows: KidsBlocklistPickerItem[] | null;
    done_button: Button | null;
    successful_toast_action_message: Text;
    constructor(data: RawNode);
}
