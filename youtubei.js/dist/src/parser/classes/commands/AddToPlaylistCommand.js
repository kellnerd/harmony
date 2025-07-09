import { YTNode } from '../../helpers.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
class AddToPlaylistCommand extends YTNode {
    constructor(data) {
        super();
        this.open_miniplayer = data.openMiniplayer;
        this.video_id = data.videoId;
        this.list_type = data.listType;
        this.endpoint = new NavigationEndpoint(data.onCreateListCommand);
        this.video_ids = data.videoIds;
    }
}
AddToPlaylistCommand.type = 'AddToPlaylistCommand';
export default AddToPlaylistCommand;
//# sourceMappingURL=AddToPlaylistCommand.js.map