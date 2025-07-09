import { YTNode } from '../helpers.js';
import RendererContext from './misc/RendererContext.js';
class ButtonCardView extends YTNode {
    constructor(data) {
        super();
        this.title = data.title;
        this.icon_name = data.image.sources[0].clientResource.imageName;
        this.renderer_context = new RendererContext(data.rendererContext);
    }
}
ButtonCardView.type = 'ButtonCardView';
export default ButtonCardView;
//# sourceMappingURL=ButtonCardView.js.map