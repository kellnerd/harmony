import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class PivotButton extends YTNode {
    static type: string;
    thumbnail: Thumbnail[];
    endpoint: NavigationEndpoint;
    content_description: Text;
    target_id: string;
    sound_attribution_title: Text;
    waveform_animation_style: string;
    background_animation_style: string;
    constructor(data: RawNode);
}
