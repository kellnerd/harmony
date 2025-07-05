import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import { Text } from '../misc.js';
import ButtonView from './ButtonView.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class TextCarouselItemView extends YTNode {
    constructor(data) {
        super();
        this.icon_name = data.iconName;
        this.text = Text.fromAttributed(data.text);
        this.on_tap_endpoint = new NavigationEndpoint(data.onTap);
        this.button = Parser.parseItem(data.button, ButtonView);
    }
}
TextCarouselItemView.type = 'TextCarouselItemView';
export default TextCarouselItemView;
//# sourceMappingURL=TextCarouselItemView.js.map