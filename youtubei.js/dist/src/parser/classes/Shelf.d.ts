import Text from './misc/Text.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import Button from './Button.js';
export default class Shelf extends YTNode {
    static type: string;
    title: Text;
    endpoint?: NavigationEndpoint;
    content: YTNode | null;
    icon_type?: string;
    menu?: YTNode | null;
    play_all_button?: Button | null;
    subtitle?: Text;
    constructor(data: RawNode);
}
