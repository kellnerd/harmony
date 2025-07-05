import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class WatchCardHeroVideo extends YTNode {
    static type: string;
    endpoint: NavigationEndpoint;
    call_to_action_button: YTNode;
    hero_image: YTNode;
    label: string;
    constructor(data: RawNode);
}
