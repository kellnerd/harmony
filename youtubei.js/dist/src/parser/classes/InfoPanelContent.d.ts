import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class InfoPanelContent extends YTNode {
    static type: string;
    title: Text;
    source: Text;
    paragraphs?: Text[];
    attributed_paragraphs?: Text[];
    thumbnail: Thumbnail[];
    source_endpoint: NavigationEndpoint;
    truncate_paragraphs: boolean;
    background: string;
    inline_link_icon_type?: string;
    constructor(data: RawNode);
}
