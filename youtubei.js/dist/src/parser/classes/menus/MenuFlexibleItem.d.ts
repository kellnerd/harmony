import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import Button from '../Button.js';
import ButtonView from '../ButtonView.js';
import MenuServiceItem from './MenuServiceItem.js';
import DownloadButton from '../DownloadButton.js';
import MenuServiceItemDownload from './MenuServiceItemDownload.js';
export default class MenuFlexibleItem extends YTNode {
    static type: string;
    menu_item: MenuServiceItem | MenuServiceItemDownload | null;
    top_level_button: DownloadButton | ButtonView | Button | null;
    constructor(data: RawNode);
}
