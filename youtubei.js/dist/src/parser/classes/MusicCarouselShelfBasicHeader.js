import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import IconLink from './IconLink.js';
import MusicThumbnail from './MusicThumbnail.js';
import Text from './misc/Text.js';
class MusicCarouselShelfBasicHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        if (Reflect.has(data, 'strapline')) {
            this.strapline = new Text(data.strapline);
        }
        if (Reflect.has(data, 'thumbnail')) {
            this.thumbnail = Parser.parseItem(data.thumbnail, MusicThumbnail);
        }
        if (Reflect.has(data, 'moreContentButton')) {
            this.more_content = Parser.parseItem(data.moreContentButton, Button);
        }
        if (Reflect.has(data, 'endIcons')) {
            this.end_icons = Parser.parseArray(data.endIcons, IconLink);
        }
    }
}
MusicCarouselShelfBasicHeader.type = 'MusicCarouselShelfBasicHeader';
export default MusicCarouselShelfBasicHeader;
//# sourceMappingURL=MusicCarouselShelfBasicHeader.js.map