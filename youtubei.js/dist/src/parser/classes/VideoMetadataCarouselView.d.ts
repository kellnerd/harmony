import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import CarouselItemView from './CarouselItemView.js';
import CarouselTitleView from './CarouselTitleView.js';
export default class VideoMetadataCarouselView extends YTNode {
    static type: string;
    carousel_titles: ObservedArray<CarouselTitleView> | null;
    carousel_items: ObservedArray<CarouselItemView> | null;
    constructor(data: RawNode);
}
