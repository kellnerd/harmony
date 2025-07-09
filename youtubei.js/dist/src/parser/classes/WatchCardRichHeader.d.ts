import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
export default class WatchCardRichHeader extends YTNode {
    static type: string;
    title: Text;
    title_endpoint: NavigationEndpoint;
    subtitle: Text;
    author: Author;
    style: string;
    constructor(data: RawNode);
}
