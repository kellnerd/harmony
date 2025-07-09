import { YTNode } from '../../../helpers.js';
import { Parser } from '../../../index.js';
import Thumbnail from '../../misc/Thumbnail.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
class LiveChatTickerPaidStickerItem extends YTNode {
    constructor(data) {
        super();
        this.id = data.id;
        this.author_external_channel_id = data.authorExternalChannelId;
        this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
        this.start_background_color = data.startBackgroundColor;
        this.end_background_color = data.endBackgroundColor;
        this.duration_sec = data.durationSec;
        this.full_duration_sec = data.fullDurationSec;
        this.show_item = Parser.parseItem(data.showItemEndpoint?.showLiveChatItemEndpoint?.renderer);
        this.show_item_endpoint = new NavigationEndpoint(data.showItemEndpoint);
        this.ticker_thumbnails = data.tickerThumbnails.map((item) => ({
            thumbnails: Thumbnail.fromResponse(item),
            label: item?.accessibility?.accessibilityData?.label
        }));
    }
}
LiveChatTickerPaidStickerItem.type = 'LiveChatTickerPaidStickerItem';
export default LiveChatTickerPaidStickerItem;
//# sourceMappingURL=LiveChatTickerPaidStickerItem.js.map