import { YTNode } from '../../../helpers.js';
import { type RawNode } from '../../../index.js';
import ButtonView from '../../ButtonView.js';
import Text from '../../misc/Text.js';
export default class PdgReplyButtonView extends YTNode {
    static type: string;
    reply_button: ButtonView | null;
    reply_count_entity_key: string;
    reply_count_placeholder: Text;
    constructor(data: RawNode);
}
