import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { Text } from '../misc.js';
export default class TranscriptSearchBox extends YTNode {
    static type: string;
    formatted_placeholder: Text;
    clear_button: Button | null;
    endpoint: NavigationEndpoint;
    search_button: Button | null;
    constructor(data: RawNode);
}
