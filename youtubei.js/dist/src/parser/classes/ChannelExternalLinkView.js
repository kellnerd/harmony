import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class ChannelExternalLinkView extends YTNode {
    constructor(data) {
        super();
        this.title = Text.fromAttributed(data.title);
        this.link = Text.fromAttributed(data.link);
        this.favicon = Thumbnail.fromResponse(data.favicon);
    }
}
ChannelExternalLinkView.type = 'ChannelExternalLinkView';
export default ChannelExternalLinkView;
//# sourceMappingURL=ChannelExternalLinkView.js.map