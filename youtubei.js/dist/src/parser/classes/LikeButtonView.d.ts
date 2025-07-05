import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ToggleButtonView from './ToggleButtonView.js';
export default class LikeButtonView extends YTNode {
    static type: string;
    toggle_button: ToggleButtonView | null;
    like_status_entity_key: string;
    like_status_entity: {
        key: string;
        like_status: string;
    };
    constructor(data: RawNode);
}
