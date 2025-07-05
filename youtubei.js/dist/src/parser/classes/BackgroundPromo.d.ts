import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
import Button from './Button.js';
import ButtonView from './ButtonView.js';
export default class BackgroundPromo extends YTNode {
    static type: string;
    body_text?: Text;
    cta_button?: Button | ButtonView | null;
    icon_type?: string;
    title?: Text;
    constructor(data: RawNode);
}
