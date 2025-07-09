import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
export default class CarouselItem extends YTNode {
    static type: string;
    items: ObservedArray<YTNode>;
    background_color: string;
    layout_style: string;
    pagination_thumbnails: Thumbnail[];
    paginator_alignment: string;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
