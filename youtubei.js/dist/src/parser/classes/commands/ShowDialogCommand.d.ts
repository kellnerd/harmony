import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
export default class ShowDialogCommand extends YTNode {
    static type: string;
    inline_content: YTNode | null;
    remove_default_padding: boolean;
    constructor(data: RawNode);
}
