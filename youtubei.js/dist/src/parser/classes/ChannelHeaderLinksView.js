import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class ChannelHeaderLinksView extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'firstLink')) {
            this.first_link = Text.fromAttributed(data.firstLink);
        }
        if (Reflect.has(data, 'more')) {
            this.more = Text.fromAttributed(data.more);
        }
    }
}
ChannelHeaderLinksView.type = 'ChannelHeaderLinksView';
export default ChannelHeaderLinksView;
//# sourceMappingURL=ChannelHeaderLinksView.js.map