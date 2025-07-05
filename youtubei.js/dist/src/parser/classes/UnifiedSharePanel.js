import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import StartAt from './StartAt.js';
import CopyLink from './CopyLink.js';
import SharePanelHeader from './SharePanelHeader.js';
import ThirdPartyShareTargetSection from './ThirdPartyShareTargetSection.js';
class UnifiedSharePanel extends YTNode {
    constructor(data) {
        super();
        if (data.contents) {
            const contents = data.contents.find((content) => content.thirdPartyNetworkSection);
            if (contents) {
                this.third_party_network_section = {
                    share_target_container: Parser.parseItem(contents.thirdPartyNetworkSection.shareTargetContainer, ThirdPartyShareTargetSection),
                    copy_link_container: Parser.parseItem(contents.thirdPartyNetworkSection.copyLinkContainer, CopyLink),
                    start_at_container: Parser.parseItem(contents.thirdPartyNetworkSection.startAtContainer, StartAt)
                };
            }
        }
        this.header = Parser.parseItem(data.header, SharePanelHeader);
        this.share_panel_version = data.sharePanelVersion;
        if (Reflect.has(data, 'showLoadingSpinner'))
            this.show_loading_spinner = data.showLoadingSpinner;
    }
}
UnifiedSharePanel.type = 'UnifiedSharePanel';
export default UnifiedSharePanel;
//# sourceMappingURL=UnifiedSharePanel.js.map