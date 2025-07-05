import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class ChannelAboutFullMetadata extends YTNode {
    static type: string;
    id: string;
    name: Text;
    avatar: Thumbnail[];
    canonical_channel_url: string;
    primary_links: {
        endpoint: NavigationEndpoint;
        icon: Thumbnail[];
        title: Text;
    }[];
    view_count: Text;
    joined_date: Text;
    description: Text;
    email_reveal: NavigationEndpoint;
    can_reveal_email: boolean;
    country: Text;
    buttons: ObservedArray<Button>;
    constructor(data: RawNode);
}
