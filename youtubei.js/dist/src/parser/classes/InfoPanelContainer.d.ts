import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import InfoPanelContent from './InfoPanelContent.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class InfoPanelContainer extends YTNode {
    static type: string;
    title: Text;
    menu: Menu | null;
    content: InfoPanelContent | null;
    header_endpoint?: NavigationEndpoint;
    background: string;
    title_style?: string;
    icon_type?: string;
    constructor(data: RawNode);
}
