import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import AvatarView from './AvatarView.js';
import RendererContext from './misc/RendererContext.js';
class DecoratedAvatarView extends YTNode {
    constructor(data) {
        super();
        this.avatar = Parser.parseItem(data.avatar, AvatarView);
        this.a11y_label = data.a11yLabel;
        this.renderer_context = new RendererContext(data.rendererContext);
    }
}
DecoratedAvatarView.type = 'DecoratedAvatarView';
export default DecoratedAvatarView;
//# sourceMappingURL=DecoratedAvatarView.js.map