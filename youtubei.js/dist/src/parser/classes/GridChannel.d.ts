import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class GridChannel extends YTNode {
    static type: string;
    id: string;
    author: Author;
    subscribers: Text;
    video_count: Text;
    endpoint: NavigationEndpoint;
    subscribe_button: YTNode;
    constructor(data: RawNode);
}
