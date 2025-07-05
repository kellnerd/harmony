import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class ActiveAccountHeader extends YTNode {
    static type: string;
    account_name: Text;
    account_photo: Thumbnail[];
    endpoint: NavigationEndpoint;
    manage_account_title: Text;
    channel_handle: Text;
    constructor(data: RawNode);
}
