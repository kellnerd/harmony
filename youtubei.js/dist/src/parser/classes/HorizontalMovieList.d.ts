import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
import Button from './Button.js';
export default class HorizontalMovieList extends YTNode {
    static type: string;
    items: ObservedArray<YTNode>;
    previous_button: Button | null;
    next_button: Button | null;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
