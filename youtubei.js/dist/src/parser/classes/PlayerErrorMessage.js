import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class PlayerErrorMessage extends YTNode {
    constructor(data) {
        super();
        this.subreason = new Text(data.subreason);
        this.reason = new Text(data.reason);
        this.proceed_button = Parser.parseItem(data.proceedButton, Button);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        if (Reflect.has(data, 'icon')) {
            this.icon_type = data.icon.iconType;
        }
    }
}
PlayerErrorMessage.type = 'PlayerErrorMessage';
export default PlayerErrorMessage;
//# sourceMappingURL=PlayerErrorMessage.js.map