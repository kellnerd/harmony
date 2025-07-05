import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class PlaylistAddToOption extends YTNode {
    constructor(data) {
        super();
        this.add_to_playlist_service_endpoint = new NavigationEndpoint(data.addToPlaylistServiceEndpoint);
        this.contains_selected_videos = data.containsSelectedVideos;
        this.playlist_id = data.playlistId;
        this.privacy = data.privacy;
        this.privacy_icon = { icon_type: data.privacyIcon?.iconType || null };
        this.remove_from_playlist_service_endpoint = new NavigationEndpoint(data.removeFromPlaylistServiceEndpoint);
        this.title = new Text(data.title);
    }
}
PlaylistAddToOption.type = 'PlaylistAddToOption';
export default PlaylistAddToOption;
//# sourceMappingURL=PlaylistAddToOption.js.map