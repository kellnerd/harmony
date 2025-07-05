import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import StartAt from './StartAt.js';
import CopyLink from './CopyLink.js';
import SharePanelHeader from './SharePanelHeader.js';
import ThirdPartyShareTargetSection from './ThirdPartyShareTargetSection.js';
export type ThirdPartyNetworkSection = {
    share_target_container: ThirdPartyShareTargetSection | null;
    copy_link_container: CopyLink | null;
    start_at_container: StartAt | null;
};
export default class UnifiedSharePanel extends YTNode {
    static type: string;
    third_party_network_section?: ThirdPartyNetworkSection;
    header: SharePanelHeader | null;
    share_panel_version: number;
    show_loading_spinner?: boolean;
    constructor(data: RawNode);
}
