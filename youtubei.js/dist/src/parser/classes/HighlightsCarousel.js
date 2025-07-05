import NavigationEndpoint from './NavigationEndpoint.js';
import Thumbnail from './misc/Thumbnail.js';
import { YTNode, observe } from '../helpers.js';
export class Panel extends YTNode {
    constructor(data) {
        super();
        if (data.thumbnail) {
            this.thumbnail = {
                image: Thumbnail.fromResponse(data.thumbnail.image),
                endpoint: new NavigationEndpoint(data.thumbnail.onTap),
                on_long_press_endpoint: new NavigationEndpoint(data.thumbnail.onLongPress),
                content_mode: data.thumbnail.contentMode,
                crop_options: data.thumbnail.cropOptions
            };
        }
        this.background_image = {
            image: Thumbnail.fromResponse(data.backgroundImage.image),
            gradient_image: Thumbnail.fromResponse(data.backgroundImage.gradientImage)
        };
        this.strapline = data.strapline;
        this.title = data.title;
        this.description = data.description;
        this.cta = {
            icon_name: data.cta.iconName,
            title: data.cta.title,
            endpoint: new NavigationEndpoint(data.cta.onTap),
            accessibility_text: data.cta.accessibilityText,
            state: data.cta.state
        };
        this.text_on_tap_endpoint = new NavigationEndpoint(data.textOnTap);
    }
}
Panel.type = 'Panel';
class HighlightsCarousel extends YTNode {
    constructor(data) {
        super();
        this.panels = observe(data.highlightsCarousel.panels.map((el) => new Panel(el)));
    }
}
HighlightsCarousel.type = 'HighlightsCarousel';
export default HighlightsCarousel;
//# sourceMappingURL=HighlightsCarousel.js.map