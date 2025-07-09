import { YTNode } from '../../../helpers.js';
import Text from '../../misc/Text.js';
class LiveChatRestrictedParticipation extends YTNode {
    constructor(data) {
        super();
        this.message = new Text(data.message);
        if (Reflect.has(data, 'icon') && Reflect.has(data.icon, 'iconType')) {
            this.icon_type = data.icon.iconType;
        }
        // TODO: parse onClickCommand
    }
}
LiveChatRestrictedParticipation.type = 'LiveChatRestrictedParticipation';
export default LiveChatRestrictedParticipation;
//# sourceMappingURL=LiveChatRestrictedParticipation.js.map