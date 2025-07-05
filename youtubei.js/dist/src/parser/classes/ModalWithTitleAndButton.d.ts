import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import Text from './misc/Text.js';
export default class ModalWithTitleAndButton extends YTNode {
    static type: string;
    title: Text;
    content: Text;
    button: Button | null;
    constructor(data: RawNode);
}
