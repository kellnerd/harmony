import { YTNode, type ObservedArray } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export declare class HeaderLink extends YTNode {
    static type: string;
    endpoint: NavigationEndpoint;
    icon: Thumbnail[];
    title: Text;
    constructor(data: RawNode);
}
export default class ChannelHeaderLinks extends YTNode {
    static type: string;
    primary: ObservedArray<HeaderLink>;
    secondary: ObservedArray<HeaderLink>;
    constructor(data: RawNode);
}
