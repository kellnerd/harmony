import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
import type { RawNode } from '../index.js';
export default class InfoRow extends YTNode {
    static type: string;
    title: Text;
    default_metadata?: Text;
    expanded_metadata?: Text;
    info_row_expand_status_key?: string;
    constructor(data: RawNode);
}
