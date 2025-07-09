import { Parser } from '../index.js';
import { YTNode, observe } from '../helpers.js';
import PlaylistPanelVideo from './PlaylistPanelVideo.js';
class PlaylistPanelVideoWrapper extends YTNode {
    constructor(data) {
        super();
        this.primary = Parser.parseItem(data.primaryRenderer, PlaylistPanelVideo);
        if (Reflect.has(data, 'counterpart')) {
            this.counterpart = observe(data.counterpart.map((item) => Parser.parseItem(item.counterpartRenderer, PlaylistPanelVideo)) || []);
        }
    }
}
PlaylistPanelVideoWrapper.type = 'PlaylistPanelVideoWrapper';
export default PlaylistPanelVideoWrapper;
//# sourceMappingURL=PlaylistPanelVideoWrapper.js.map