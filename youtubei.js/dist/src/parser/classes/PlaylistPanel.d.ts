import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import AutomixPreviewVideo from './AutomixPreviewVideo.js';
import PlaylistPanelVideo from './PlaylistPanelVideo.js';
import PlaylistPanelVideoWrapper from './PlaylistPanelVideoWrapper.js';
import Text from './misc/Text.js';
export default class PlaylistPanel extends YTNode {
    static type: string;
    title: string;
    title_text: Text;
    contents: ObservedArray<PlaylistPanelVideoWrapper | PlaylistPanelVideo | AutomixPreviewVideo>;
    playlist_id: string;
    is_infinite: boolean;
    continuation: string;
    is_editable: boolean;
    preview_description: string;
    num_items_to_show: string;
    constructor(data: RawNode);
}
