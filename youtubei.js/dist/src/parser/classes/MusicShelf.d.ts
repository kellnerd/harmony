import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import MusicResponsiveListItem from './MusicResponsiveListItem.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class MusicShelf extends YTNode {
    static type: string;
    title: Text;
    contents: ObservedArray<MusicResponsiveListItem>;
    endpoint?: NavigationEndpoint;
    continuation?: string;
    bottom_text?: Text;
    bottom_button?: Button | null;
    subheaders?: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
