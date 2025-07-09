import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import DropdownView from './DropdownView.js';
import TextFieldView from './TextFieldView.js';
class CreatePlaylistDialogFormView extends YTNode {
    constructor(data) {
        super();
        this.playlist_title = Parser.parseItem(data.playlistTitle, TextFieldView);
        this.playlist_visibility = Parser.parseItem(data.playlistVisibility, DropdownView);
        this.disable_playlist_collaborate = !!data.disablePlaylistCollaborate;
        this.create_playlist_params_collaboration_enabled = data.createPlaylistParamsCollaborationEnabled;
        this.create_playlist_params_collaboration_disabled = data.createPlaylistParamsCollaborationDisabled;
        this.video_ids = data.videoIds;
    }
}
CreatePlaylistDialogFormView.type = 'CreatePlaylistDialogFormView';
export default CreatePlaylistDialogFormView;
//# sourceMappingURL=CreatePlaylistDialogFormView.js.map