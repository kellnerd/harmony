import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class MusicNavigationButton extends YTNode {
    static type: string;
    button_text: string;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
