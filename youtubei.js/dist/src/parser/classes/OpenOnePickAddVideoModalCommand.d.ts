import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
export default class OpenOnePickAddVideoModalCommand extends YTNode {
    static type: string;
    list_id: string;
    modal_title: string;
    select_button_label: string;
    constructor(data: RawNode);
}
