import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import TextCarouselItemView from './TextCarouselItemView.js';
class CarouselItemView extends YTNode {
    constructor(data) {
        super();
        this.item_type = data.itemType;
        this.carousel_item = Parser.parseItem(data.carouselItem, TextCarouselItemView);
    }
}
CarouselItemView.type = 'CarouselItemView';
export default CarouselItemView;
//# sourceMappingURL=CarouselItemView.js.map