import Text from '../misc/Text.js';
import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
import ToggleButton from '../ToggleButton.js';
import Thumbnail from '../misc/Thumbnail.js';
import type Actions from '../../../core/Actions.js';
import { type ApiResponse } from '../../../core/Actions.js';
export default class KidsBlocklistPickerItem extends YTNode {
    #private;
    static type: string;
    child_display_name: Text;
    child_account_description: Text;
    avatar: Thumbnail[];
    block_button: ToggleButton | null;
    blocked_entity_key: string;
    constructor(data: RawNode);
    blockChannel(): Promise<ApiResponse>;
    setActions(actions: Actions | undefined): void;
}
