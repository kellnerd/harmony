import { YTNode } from '../../../helpers.js';
import { Parser } from '../../../index.js';
import LiveChatBannerHeader from './LiveChatBannerHeader.js';
class LiveChatBanner extends YTNode {
    constructor(data) {
        super();
        this.header = Parser.parseItem(data.header, LiveChatBannerHeader);
        this.contents = Parser.parseItem(data.contents);
        this.action_id = data.actionId;
        if (Reflect.has(data, 'viewerIsCreator')) {
            this.viewer_is_creator = data.viewerIsCreator;
        }
        this.target_id = data.targetId;
        this.is_stackable = data.isStackable;
        if (Reflect.has(data, 'backgroundType')) {
            this.background_type = data.backgroundType;
        }
        this.banner_type = data.bannerType;
        if (Reflect.has(data, 'bannerProperties') &&
            Reflect.has(data.bannerProperties, 'isEphemeral')) {
            this.banner_properties_is_ephemeral = Boolean(data.bannerProperties.isEphemeral);
        }
        if (Reflect.has(data, 'bannerProperties') &&
            Reflect.has(data.bannerProperties, 'autoCollapseDelay') &&
            Reflect.has(data.bannerProperties.autoCollapseDelay, 'seconds')) {
            this.banner_properties_auto_collapse_delay_seconds = data.bannerProperties.autoCollapseDelay.seconds;
        }
    }
}
LiveChatBanner.type = 'LiveChatBanner';
export default LiveChatBanner;
//# sourceMappingURL=LiveChatBanner.js.map