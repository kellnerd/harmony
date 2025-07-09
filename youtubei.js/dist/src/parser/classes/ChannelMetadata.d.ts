import Thumbnail from './misc/Thumbnail.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ChannelMetadata extends YTNode {
    static type: string;
    title: string;
    description: string;
    url: string;
    rss_url: string;
    vanity_channel_url: string;
    external_id: string;
    is_family_safe: boolean;
    keywords: string[];
    avatar: Thumbnail[];
    music_artist_name?: string;
    available_countries: string[];
    android_deep_link: string;
    android_appindexing_link: string;
    ios_appindexing_link: string;
    constructor(data: RawNode);
}
