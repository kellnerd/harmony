import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Dropdown from './Dropdown.js';
import Text from './misc/Text.js';
export default class MusicPlaylistEditHeader extends YTNode {
    static type: string;
    title: Text;
    edit_title: Text;
    edit_description: Text;
    privacy: string;
    playlist_id: string;
    endpoint: NavigationEndpoint;
    privacy_dropdown: Dropdown | null;
    constructor(data: RawNode);
}
