import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ButtonView from './ButtonView.js';
export default class CarouselTitleView extends YTNode {
    static type: string;
    title: string;
    previous_button: ButtonView | null;
    next_button: ButtonView | null;
    constructor(data: RawNode);
}
