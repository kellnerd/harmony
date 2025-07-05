import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
/**
 * Not a real renderer but we treat it as one to keep things organized.
 */
export default class AccountItem extends YTNode {
    static type: string;
    account_name: Text;
    account_photo: Thumbnail[];
    is_selected: boolean;
    is_disabled: boolean;
    has_channel: boolean;
    endpoint: NavigationEndpoint;
    account_byline: Text;
    channel_handle: Text;
    constructor(data: RawNode);
}
