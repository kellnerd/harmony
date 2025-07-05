import { type ObservedArray, YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import Text from '../misc/Text.js';
export default class EmojiPicker extends YTNode {
    static type: string;
    id: string;
    categories: ObservedArray<YTNode>;
    category_buttons: ObservedArray<YTNode>;
    search_placeholder: Text;
    search_no_results: Text;
    pick_skin_tone: Text;
    clear_search_label: string;
    skin_tone_generic_label: string;
    skin_tone_light_label: string;
    skin_tone_medium_light_label: string;
    skin_tone_medium_label: string;
    skin_tone_medium_dark_label: string;
    skin_tone_dark_label: string;
    constructor(data: RawNode);
}
