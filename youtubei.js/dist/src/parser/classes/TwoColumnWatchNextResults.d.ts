import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
type AutoplaySet = {
    autoplay_video: NavigationEndpoint;
    next_button_video?: NavigationEndpoint;
};
export default class TwoColumnWatchNextResults extends YTNode {
    #private;
    static type: string;
    results: ObservedArray<YTNode>;
    secondary_results: ObservedArray<YTNode>;
    conversation_bar: YTNode;
    playlist?: {
        id: string;
        title: string;
        author: Text | Author;
        contents: YTNode[];
        current_index: number;
        is_infinite: boolean;
        menu: Menu | null;
    };
    autoplay?: {
        sets: AutoplaySet[];
        modified_sets?: AutoplaySet[];
        count_down_secs?: number;
    };
    constructor(data: RawNode);
}
export {};
