import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Text from './misc/Text.js';
import AvatarView from './AvatarView.js';
import RendererContext from './misc/RendererContext.js';
class AvatarStackView extends YTNode {
    constructor(data) {
        super();
        this.avatars = Parser.parseArray(data.avatars, AvatarView);
        if (Reflect.has(data, 'text'))
            this.text = Text.fromAttributed(data.text);
        this.renderer_context = new RendererContext(data.rendererContext);
    }
}
AvatarStackView.type = 'AvatarStackView';
export default AvatarStackView;
//# sourceMappingURL=AvatarStackView.js.map