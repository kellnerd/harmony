import { type RawNode } from '../index.js';
import ChildElement from './misc/ChildElement.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class Element extends YTNode {
    static type: string;
    model?: YTNode;
    child_elements?: ObservedArray<ChildElement>;
    constructor(data: RawNode);
}
