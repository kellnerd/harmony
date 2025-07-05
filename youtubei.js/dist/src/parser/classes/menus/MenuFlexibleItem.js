import { Parser } from '../../index.js';
import { YTNode } from '../../helpers.js';
import Button from '../Button.js';
import ButtonView from '../ButtonView.js';
import MenuServiceItem from './MenuServiceItem.js';
import DownloadButton from '../DownloadButton.js';
import MenuServiceItemDownload from './MenuServiceItemDownload.js';
class MenuFlexibleItem extends YTNode {
    constructor(data) {
        super();
        this.menu_item = Parser.parseItem(data.menuItem, [MenuServiceItem, MenuServiceItemDownload]);
        this.top_level_button = Parser.parseItem(data.topLevelButton, [DownloadButton, ButtonView, Button]);
    }
}
MenuFlexibleItem.type = 'MenuFlexibleItem';
export default MenuFlexibleItem;
//# sourceMappingURL=MenuFlexibleItem.js.map