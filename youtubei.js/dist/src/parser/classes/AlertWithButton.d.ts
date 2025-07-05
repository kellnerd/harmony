import Button from './Button.js';
import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class AlertWithButton extends YTNode {
    static type: string;
    text: Text;
    alert_type: string;
    dismiss_button: Button | null;
    constructor(data: RawNode);
}
