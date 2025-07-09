import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ContentMetadataView from './ContentMetadataView.js';
import DecoratedAvatarView from './DecoratedAvatarView.js';
import Text from './misc/Text.js';
import ButtonView from './ButtonView.js';
class LockupMetadataView extends YTNode {
    constructor(data) {
        super();
        this.title = Text.fromAttributed(data.title);
        this.metadata = Parser.parseItem(data.metadata, ContentMetadataView);
        this.image = Parser.parseItem(data.image, DecoratedAvatarView);
        this.menu_button = Parser.parseItem(data.menuButton, ButtonView);
    }
}
LockupMetadataView.type = 'LockupMetadataView';
export default LockupMetadataView;
//# sourceMappingURL=LockupMetadataView.js.map