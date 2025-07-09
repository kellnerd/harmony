import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class CallToActionButton extends YTNode {
    static type: string;
    label: Text;
    icon_type: string;
    style: string;
    constructor(data: RawNode);
}
