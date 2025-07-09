import Text from '../misc/Text.js';
import { YTNode } from '../../helpers.js';
class PdgCommentChip extends YTNode {
    constructor(data) {
        super();
        this.text = new Text(data.chipText);
        this.color_pallette = {
            background_color: data.chipColorPalette?.backgroundColor,
            foreground_title_color: data.chipColorPalette?.foregroundTitleColor
        };
        if (Reflect.has(data, 'chipIcon') && Reflect.has(data.chipIcon, 'iconType')) {
            this.icon_type = data.chipIcon.iconType;
        }
    }
}
PdgCommentChip.type = 'PdgCommentChip';
export default PdgCommentChip;
//# sourceMappingURL=PdgCommentChip.js.map