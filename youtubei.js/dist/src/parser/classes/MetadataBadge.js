import { YTNode } from '../helpers.js';
class MetadataBadge extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'icon')) {
            this.icon_type = data.icon.iconType;
        }
        if (Reflect.has(data, 'style')) {
            this.style = data.style;
        }
        if (Reflect.has(data, 'label')) {
            this.label = data.label;
        }
        if (Reflect.has(data, 'tooltip') || Reflect.has(data, 'iconTooltip')) {
            this.tooltip = data.tooltip || data.iconTooltip;
        }
    }
}
MetadataBadge.type = 'MetadataBadge';
export default MetadataBadge;
//# sourceMappingURL=MetadataBadge.js.map