import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { Text } from '../misc.js';
export default class FancyDismissibleDialog extends YTNode {
    static type: string;
    dialog_message: Text;
    confirm_label: Text;
    constructor(data: RawNode);
}
