import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class DidYouMean extends YTNode {
    static type: string;
    text: string;
    corrected_query: Text;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
