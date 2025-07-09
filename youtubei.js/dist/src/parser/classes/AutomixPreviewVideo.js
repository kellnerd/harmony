import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class AutomixPreviewVideo extends YTNode {
    constructor(data) {
        super();
        if (data?.content?.automixPlaylistVideoRenderer?.navigationEndpoint) {
            this.playlist_video = {
                endpoint: new NavigationEndpoint(data.content.automixPlaylistVideoRenderer.navigationEndpoint)
            };
        }
    }
}
AutomixPreviewVideo.type = 'AutomixPreviewVideo';
export default AutomixPreviewVideo;
//# sourceMappingURL=AutomixPreviewVideo.js.map