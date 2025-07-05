import Text from '../misc/Text.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class UpdateViewershipAction extends YTNode {
    static type: string;
    view_count: Text;
    extra_short_view_count: Text;
    original_view_count: number;
    unlabeled_view_count_value: Text;
    is_live: boolean;
    constructor(data: RawNode);
}
