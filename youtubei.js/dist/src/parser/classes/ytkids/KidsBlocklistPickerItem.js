var _KidsBlocklistPickerItem_actions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import Text from '../misc/Text.js';
import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
import ToggleButton from '../ToggleButton.js';
import Thumbnail from '../misc/Thumbnail.js';
import { InnertubeError } from '../../../utils/Utils.js';
class KidsBlocklistPickerItem extends YTNode {
    constructor(data) {
        super();
        _KidsBlocklistPickerItem_actions.set(this, void 0);
        this.child_display_name = new Text(data.childDisplayName);
        this.child_account_description = new Text(data.childAccountDescription);
        this.avatar = Thumbnail.fromResponse(data.avatar);
        this.block_button = Parser.parseItem(data.blockButton, [ToggleButton]);
        this.blocked_entity_key = data.blockedEntityKey;
    }
    async blockChannel() {
        if (!__classPrivateFieldGet(this, _KidsBlocklistPickerItem_actions, "f"))
            throw new InnertubeError('An active caller must be provide to perform this operation.');
        const button = this.block_button;
        if (!button)
            throw new InnertubeError('Block button was not found.', { child_display_name: this.child_display_name });
        if (button.is_toggled)
            throw new InnertubeError('This channel is already blocked.', { child_display_name: this.child_display_name });
        const response = await button.endpoint.call(__classPrivateFieldGet(this, _KidsBlocklistPickerItem_actions, "f"), { parse: false });
        return response;
    }
    setActions(actions) {
        __classPrivateFieldSet(this, _KidsBlocklistPickerItem_actions, actions, "f");
    }
}
_KidsBlocklistPickerItem_actions = new WeakMap();
KidsBlocklistPickerItem.type = 'KidsBlocklistPickerItem';
export default KidsBlocklistPickerItem;
//# sourceMappingURL=KidsBlocklistPickerItem.js.map