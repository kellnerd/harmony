import { YTNode } from '../../../helpers.js';
import Text from '../../misc/Text.js';
class BumperUserEduContentView extends YTNode {
    constructor(data) {
        super();
        this.text = Text.fromAttributed(data.text);
        this.image_name = data.image.sources[0].clientResource.imageName;
        this.image_color = data.image.sources[0].clientResource.imageColor;
    }
}
BumperUserEduContentView.type = 'BumperUserEduContentView';
export default BumperUserEduContentView;
//# sourceMappingURL=BumperUserEduContentView.js.map