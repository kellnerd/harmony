import { YTNode } from '../../helpers.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
class MenuServiceItemDownload extends YTNode {
    constructor(data) {
        super();
        this.has_separator = !!data.hasSeparator;
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint || data.serviceEndpoint);
    }
}
MenuServiceItemDownload.type = 'MenuServiceItemDownload';
export default MenuServiceItemDownload;
//# sourceMappingURL=MenuServiceItemDownload.js.map