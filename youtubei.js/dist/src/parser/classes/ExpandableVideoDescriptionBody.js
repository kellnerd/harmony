import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class ExpandableVideoDescriptionBody extends YTNode {
    constructor(data) {
        super();
        this.show_more_text = new Text(data.showMoreText);
        this.show_less_text = new Text(data.showLessText);
        if (Reflect.has(data, 'attributedDescriptionBodyText')) {
            this.attributed_description_body_text = Text.fromAttributed(data.attributedDescriptionBodyText);
        }
    }
}
ExpandableVideoDescriptionBody.type = 'ExpandableVideoDescriptionBody';
export default ExpandableVideoDescriptionBody;
//# sourceMappingURL=ExpandableVideoDescriptionBody.js.map