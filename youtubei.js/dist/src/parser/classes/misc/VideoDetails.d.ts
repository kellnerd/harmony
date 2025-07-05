import Thumbnail from './Thumbnail.js';
import type { RawNode } from '../../index.js';
export default class VideoDetails {
    id: string;
    channel_id: string;
    title: string;
    duration: number;
    keywords: string[];
    is_owner_viewing: boolean;
    short_description: string;
    thumbnail: Thumbnail[];
    allow_ratings: boolean;
    view_count: number;
    author: string;
    is_private: boolean;
    is_live: boolean;
    is_live_content: boolean;
    is_live_dvr_enabled: boolean;
    is_upcoming: boolean;
    is_crawlable: boolean;
    is_post_live_dvr: boolean;
    is_low_latency_live_stream: boolean;
    live_chunk_readahead?: number;
    constructor(data: RawNode);
}
