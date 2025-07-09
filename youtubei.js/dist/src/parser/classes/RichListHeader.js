import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
class RichListHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.subtitle = new Text(data.subtitle);
        if (Reflect.has(data, 'titleStyle')) {
            this.title_style = data.titleStyle.style;
        }
        if (Reflect.has(data, 'icon')) {
            this.icon_type = data.icon.iconType;
        }
    }
}
RichListHeader.type = 'RichListHeader';
export default RichListHeader;
//# sourceMappingURL=RichListHeader.js.map