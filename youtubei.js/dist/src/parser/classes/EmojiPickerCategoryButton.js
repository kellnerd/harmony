import { YTNode } from '../helpers.js';
class EmojiPickerCategoryButton extends YTNode {
    constructor(data) {
        super();
        this.category_id = data.categoryId;
        if (Reflect.has(data, 'icon')) {
            this.icon_type = data.icon?.iconType;
        }
        this.tooltip = data.tooltip;
    }
}
EmojiPickerCategoryButton.type = 'EmojiPickerCategoryButton';
export default EmojiPickerCategoryButton;
//# sourceMappingURL=EmojiPickerCategoryButton.js.map