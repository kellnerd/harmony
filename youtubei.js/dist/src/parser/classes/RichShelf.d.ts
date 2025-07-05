import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class RichShelf extends YTNode {
    static type: string;
    title: Text;
    contents: ObservedArray<YTNode>;
    endpoint?: NavigationEndpoint;
    subtitle?: Text;
    is_expanded: boolean;
    is_bottom_divider_hidden: boolean;
    is_top_divider_hidden: boolean;
    layout_sizing?: 'RICH_GRID_LAYOUT_SIZING_UNSPECIFIED' | 'RICH_GRID_LAYOUT_SIZING_STANDARD' | 'RICH_GRID_LAYOUT_SIZING_COMPACT' | 'RICH_GRID_LAYOUT_SIZING_EXTRA_COMPACT' | 'RICH_GRID_LAYOUT_SIZING_TINY';
    icon_type?: string;
    menu: YTNode | null;
    next_button: YTNode | null;
    previous_button: YTNode | null;
    constructor(data: RawNode);
}
