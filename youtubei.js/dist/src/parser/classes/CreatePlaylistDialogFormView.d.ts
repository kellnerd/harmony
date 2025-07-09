import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import DropdownView from './DropdownView.js';
import TextFieldView from './TextFieldView.js';
export default class CreatePlaylistDialogFormView extends YTNode {
    static type: string;
    playlist_title: TextFieldView | null;
    playlist_visibility: DropdownView | null;
    disable_playlist_collaborate: boolean;
    create_playlist_params_collaboration_enabled: string;
    create_playlist_params_collaboration_disabled: string;
    video_ids: string[];
    constructor(data: RawNode);
}
