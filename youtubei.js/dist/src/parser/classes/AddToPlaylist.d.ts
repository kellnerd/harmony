import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import MenuTitle from './MenuTitle.js';
import PlaylistAddToOption from './PlaylistAddToOption.js';
export default class AddToPlaylist extends YTNode {
    static type: string;
    actions: ObservedArray<MenuTitle | Button>;
    playlists: ObservedArray<PlaylistAddToOption>;
    constructor(data: RawNode);
}
