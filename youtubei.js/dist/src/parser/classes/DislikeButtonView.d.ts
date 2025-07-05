import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ToggleButtonView from './ToggleButtonView.js';
export default class DislikeButtonView extends YTNode {
    static type: string;
    toggle_button: ToggleButtonView | null;
    dislike_entity_key: string;
    constructor(data: RawNode);
}
