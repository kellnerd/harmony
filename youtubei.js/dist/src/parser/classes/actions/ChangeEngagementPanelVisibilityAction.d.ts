import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class ChangeEngagementPanelVisibilityAction extends YTNode {
    static type: string;
    target_id: string;
    visibility: string;
    constructor(data: RawNode);
}
