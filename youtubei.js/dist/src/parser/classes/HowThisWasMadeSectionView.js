import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class HowThisWasMadeSectionView extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'sectionText'))
            this.section_title = Text.fromAttributed(data.sectionText);
        if (Reflect.has(data, 'bodyText'))
            this.body_text = Text.fromAttributed(data.bodyText);
        if (Reflect.has(data, 'bodyHeader'))
            this.body_header = Text.fromAttributed(data.bodyHeader);
    }
}
HowThisWasMadeSectionView.type = 'HowThisWasMadeSectionView';
export default HowThisWasMadeSectionView;
//# sourceMappingURL=HowThisWasMadeSectionView.js.map