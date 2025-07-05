import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ThumbnailView from './ThumbnailView.js';
class CollectionThumbnailView extends YTNode {
    constructor(data) {
        super();
        this.primary_thumbnail = Parser.parseItem(data.primaryThumbnail, ThumbnailView);
        if (data.stackColor) {
            this.stack_color = {
                light_theme: data.stackColor.lightTheme,
                dark_theme: data.stackColor.darkTheme
            };
        }
    }
}
CollectionThumbnailView.type = 'CollectionThumbnailView';
export default CollectionThumbnailView;
//# sourceMappingURL=CollectionThumbnailView.js.map