import { type RawNode } from '../index.js';
import Element from './Element.js';
import { YTNode } from '../helpers.js';
export default class MusicElementHeader extends YTNode {
    static type: string;
    element: Element | null;
    constructor(data: RawNode);
}
