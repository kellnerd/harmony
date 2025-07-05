import Button from './Button.js';
import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class AlertWithButton extends YTNode {
    constructor(data) {
        super();
        this.text = new Text(data.text);
        this.alert_type = data.type;
        this.dismiss_button = Parser.parseItem(data.dismissButton, Button);
    }
}
AlertWithButton.type = 'AlertWithButton';
export default AlertWithButton;
//# sourceMappingURL=AlertWithButton.js.map