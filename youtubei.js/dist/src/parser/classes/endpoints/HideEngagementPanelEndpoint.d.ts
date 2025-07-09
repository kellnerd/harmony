import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class HideEngagementPanelEndpoint extends YTNode {
    static type: string;
    panel_identifier: string;
    constructor(data: RawNode);
}
