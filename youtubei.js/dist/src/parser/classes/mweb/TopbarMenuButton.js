import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
class TopbarMenuButton extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'icon') && Reflect.has(data.icon, 'iconType'))
            this.icon_type = data.icon.iconType;
        this.menu_renderer = Parser.parseItem(data.menuRenderer);
        this.target_id = data.targetId;
    }
}
TopbarMenuButton.type = 'TopbarMenuButton';
export default TopbarMenuButton;
//# sourceMappingURL=TopbarMenuButton.js.map