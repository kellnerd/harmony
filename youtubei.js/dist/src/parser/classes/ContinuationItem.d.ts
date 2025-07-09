import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class ContinuationItem extends YTNode {
    static type: string;
    trigger: string;
    button?: Button | null;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
