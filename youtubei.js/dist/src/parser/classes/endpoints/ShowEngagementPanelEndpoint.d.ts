import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class ShowEngagementPanelEndpoint extends YTNode {
    static type: string;
    panel_identifier: string;
    source_panel_identifier?: string;
    constructor(data: RawNode);
}
