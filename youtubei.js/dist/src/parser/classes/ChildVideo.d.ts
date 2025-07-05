import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class ChildVideo extends YTNode {
    static type: string;
    id: string;
    title: Text;
    duration: {
        text: string;
        seconds: number;
    };
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
