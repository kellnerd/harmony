import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import MenuTitle from './MenuTitle.js';
import PlaylistAddToOption from './PlaylistAddToOption.js';
class AddToPlaylist extends YTNode {
    constructor(data) {
        super();
        this.actions = Parser.parseArray(data.actions, [MenuTitle, Button]);
        this.playlists = Parser.parseArray(data.playlists, PlaylistAddToOption);
    }
}
AddToPlaylist.type = 'AddToPlaylist';
export default AddToPlaylist;
//# sourceMappingURL=AddToPlaylist.js.map