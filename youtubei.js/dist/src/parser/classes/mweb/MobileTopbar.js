import { YTNode } from '../../helpers.js';
import Text from '../misc/Text.js';
import { Parser } from '../../index.js';
class MobileTopbar extends YTNode {
    constructor(data) {
        super();
        this.placeholder_text = new Text(data.placeholderText);
        this.buttons = Parser.parseArray(data.buttons);
        if (Reflect.has(data, 'logo') && Reflect.has(data.logo, 'iconType'))
            this.logo_type = data.logo.iconType;
    }
}
MobileTopbar.type = 'MobileTopbar';
export default MobileTopbar;
//# sourceMappingURL=MobileTopbar.js.map