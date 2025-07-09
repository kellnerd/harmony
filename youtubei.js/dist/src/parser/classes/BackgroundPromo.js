import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Text from './misc/Text.js';
import Button from './Button.js';
import ButtonView from './ButtonView.js';
class BackgroundPromo extends YTNode {
    constructor(data) {
        super();
        this.body_text = new Text(data.bodyText);
        this.cta_button = Parser.parseItem(data.ctaButton, [Button, ButtonView]);
        if (Reflect.has(data, 'icon'))
            this.icon_type = data.icon.iconType;
        this.title = new Text(data.title);
    }
}
BackgroundPromo.type = 'BackgroundPromo';
export default BackgroundPromo;
//# sourceMappingURL=BackgroundPromo.js.map