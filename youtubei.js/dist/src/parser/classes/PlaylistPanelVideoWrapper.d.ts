import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
import PlaylistPanelVideo from './PlaylistPanelVideo.js';
export default class PlaylistPanelVideoWrapper extends YTNode {
    static type: string;
    primary: PlaylistPanelVideo | null;
    counterpart?: ObservedArray<PlaylistPanelVideo>;
    constructor(data: RawNode);
}
