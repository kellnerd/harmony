import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import Transcript from '../Transcript.js';
export default class UpdateEngagementPanelAction extends YTNode {
    static type: string;
    target_id: string;
    content: Transcript | null;
    constructor(data: RawNode);
}
