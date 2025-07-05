import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import { Text, Thumbnail } from '../misc.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export type Option = {
    title: Text;
    subtitle: Text;
    leading_image: Thumbnail;
    value: {
        privacy_status_value?: string;
    };
    on_tap: NavigationEndpoint;
    is_selected: boolean;
};
export default class DropdownView extends YTNode {
    static type: string;
    label: Text;
    placeholder_text: Text;
    disabled: boolean;
    options?: Option[];
    dropdown_type: string;
    id: string;
    constructor(data: RawNode);
}
