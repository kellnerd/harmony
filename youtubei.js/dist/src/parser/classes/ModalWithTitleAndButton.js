import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import Text from './misc/Text.js';
class ModalWithTitleAndButton extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.content = new Text(data.content);
        this.button = Parser.parseItem(data.button, Button);
    }
}
ModalWithTitleAndButton.type = 'ModalWithTitleAndButton';
export default ModalWithTitleAndButton;
//# sourceMappingURL=ModalWithTitleAndButton.js.map