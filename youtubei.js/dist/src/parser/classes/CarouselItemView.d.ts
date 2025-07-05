import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import TextCarouselItemView from './TextCarouselItemView.js';
export default class CarouselItemView extends YTNode {
    static type: string;
    item_type: string;
    carousel_item: TextCarouselItemView | null;
    constructor(data: RawNode);
}
