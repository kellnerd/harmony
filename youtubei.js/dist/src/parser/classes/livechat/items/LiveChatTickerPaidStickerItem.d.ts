import { YTNode } from '../../../helpers.js';
import { type RawNode } from '../../../index.js';
import Thumbnail from '../../misc/Thumbnail.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
export default class LiveChatTickerPaidStickerItem extends YTNode {
    static type: string;
    id: string;
    author_external_channel_id: string;
    author_photo: Thumbnail[];
    start_background_color: number;
    end_background_color: number;
    duration_sec: number;
    full_duration_sec: number;
    show_item: YTNode;
    show_item_endpoint: NavigationEndpoint;
    ticker_thumbnails: {
        thumbnails: Thumbnail[];
        label?: string;
    }[];
    constructor(data: RawNode);
}
