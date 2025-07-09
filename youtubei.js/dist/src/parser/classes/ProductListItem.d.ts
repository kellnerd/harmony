import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { Text, Thumbnail } from '../misc.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class ProductListItem extends YTNode {
    static type: string;
    title: Text;
    accessibility_title: string;
    thumbnail: Thumbnail[];
    price: string;
    endpoint: NavigationEndpoint;
    merchant_name: string;
    stay_in_app: boolean;
    view_button: Button | null;
    constructor(data: RawNode);
}
