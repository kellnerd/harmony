import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class WatchCardHeroVideo extends YTNode {
    constructor(data) {
        super();
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.call_to_action_button = Parser.parseItem(data.callToActionButton);
        this.hero_image = Parser.parseItem(data.heroImage);
        this.label = data.lengthText?.accessibility.accessibilityData.label || '';
    }
}
WatchCardHeroVideo.type = 'WatchCardHeroVideo';
export default WatchCardHeroVideo;
//# sourceMappingURL=WatchCardHeroVideo.js.map