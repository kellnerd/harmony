import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import SubscribeButton from './SubscribeButton.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
export default class Channel extends YTNode {
    static type: string;
    id: string;
    author: Author;
    subscriber_count: Text;
    video_count: Text;
    long_byline: Text;
    short_byline: Text;
    endpoint: NavigationEndpoint;
    subscribe_button: SubscribeButton | Button | null;
    description_snippet: Text;
    constructor(data: RawNode);
}
