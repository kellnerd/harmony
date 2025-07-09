import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
type Identifier = {
    surface: string;
    tag: string;
};
export default class UpdateEngagementPanelContentCommand extends YTNode {
    static type: string;
    content_source_panel_identifier?: Identifier;
    target_panel_identifier?: Identifier;
    constructor(data: RawNode);
}
export {};
