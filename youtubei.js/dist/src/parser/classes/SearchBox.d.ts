import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class SearchBox extends YTNode {
    static type: string;
    endpoint: NavigationEndpoint;
    search_button: Button | null;
    clear_button: Button | null;
    placeholder_text: Text;
    constructor(data: RawNode);
}
