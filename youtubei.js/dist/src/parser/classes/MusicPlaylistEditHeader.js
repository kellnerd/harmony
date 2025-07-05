import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Dropdown from './Dropdown.js';
import Text from './misc/Text.js';
class MusicPlaylistEditHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.edit_title = new Text(data.editTitle);
        this.edit_description = new Text(data.editDescription);
        this.privacy = data.privacy;
        this.playlist_id = data.playlistId;
        this.endpoint = new NavigationEndpoint(data.collaborationSettingsCommand);
        this.privacy_dropdown = Parser.parseItem(data.privacyDropdown, Dropdown);
    }
}
MusicPlaylistEditHeader.type = 'MusicPlaylistEditHeader';
export default MusicPlaylistEditHeader;
//# sourceMappingURL=MusicPlaylistEditHeader.js.map