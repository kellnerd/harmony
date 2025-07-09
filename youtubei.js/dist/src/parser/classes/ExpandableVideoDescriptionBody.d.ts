import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
import type { RawNode } from '../index.js';
export default class ExpandableVideoDescriptionBody extends YTNode {
    static type: string;
    show_more_text: Text;
    show_less_text: Text;
    attributed_description_body_text?: Text;
    constructor(data: RawNode);
}
