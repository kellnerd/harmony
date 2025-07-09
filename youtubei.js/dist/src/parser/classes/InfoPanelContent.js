import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class InfoPanelContent extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.source = new Text(data.source);
        if (Reflect.has(data, 'paragraphs'))
            this.paragraphs = data.paragraphs.map((p) => new Text(p));
        if (Reflect.has(data, 'attributedParagraphs'))
            this.attributed_paragraphs = data.attributedParagraphs.map((p) => Text.fromAttributed(p));
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
        this.source_endpoint = new NavigationEndpoint(data.sourceEndpoint);
        this.truncate_paragraphs = !!data.truncateParagraphs;
        this.background = data.background;
        if (Reflect.has(data, 'inlineLinkIcon') && Reflect.has(data.inlineLinkIcon, 'iconType')) {
            this.inline_link_icon_type = data.inlineLinkIcon.iconType;
        }
    }
}
InfoPanelContent.type = 'InfoPanelContent';
export default InfoPanelContent;
//# sourceMappingURL=InfoPanelContent.js.map