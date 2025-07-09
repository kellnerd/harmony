import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ButtonView from './ButtonView.js';
class CarouselTitleView extends YTNode {
    constructor(data) {
        super();
        this.title = data.title;
        this.previous_button = Parser.parseItem(data.previousButton, ButtonView);
        this.next_button = Parser.parseItem(data.nextButton, ButtonView);
    }
}
CarouselTitleView.type = 'CarouselTitleView';
export default CarouselTitleView;
//# sourceMappingURL=CarouselTitleView.js.map