import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
import Button from './Button.js';
export default class EngagementPanelTitleHeader extends YTNode {
    static type: string;
    title: Text;
    visibility_button: Button | null;
    contextual_info?: Text;
    menu: YTNode | null;
    constructor(data: RawNode);
}
