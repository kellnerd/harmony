import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ChannelExternalLinkView from './ChannelExternalLinkView.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class AboutChannelView extends YTNode {
    static type: string;
    description?: string;
    description_label?: Text;
    country?: string;
    custom_links_label?: Text;
    subscriber_count?: string;
    view_count?: string;
    joined_date?: Text;
    canonical_channel_url?: string;
    channel_id?: string;
    additional_info_label?: Text;
    custom_url_on_tap?: NavigationEndpoint;
    video_count?: string;
    sign_in_for_business_email?: Text;
    links: ObservedArray<ChannelExternalLinkView>;
    constructor(data: RawNode);
}
