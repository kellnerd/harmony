import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import { Text } from '../misc.js';
import ButtonView from './ButtonView.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class TextCarouselItemView extends YTNode {
    static type: string;
    icon_name: string;
    text: Text;
    on_tap_endpoint: NavigationEndpoint;
    button: ButtonView | null;
    constructor(data: RawNode);
}
