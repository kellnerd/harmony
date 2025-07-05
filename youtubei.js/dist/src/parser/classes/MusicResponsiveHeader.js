import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import MusicThumbnail from './MusicThumbnail.js';
import MusicDescriptionShelf from './MusicDescriptionShelf.js';
import MusicInlineBadge from './MusicInlineBadge.js';
import MusicPlayButton from './MusicPlayButton.js';
import ToggleButton from './ToggleButton.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
import Button from './Button.js';
import DownloadButton from './DownloadButton.js';
class MusicResponsiveHeader extends YTNode {
    constructor(data) {
        super();
        this.thumbnail = Parser.parseItem(data.thumbnail, MusicThumbnail);
        this.buttons = Parser.parseArray(data.buttons, [DownloadButton, ToggleButton, MusicPlayButton, Button, Menu]);
        this.title = new Text(data.title);
        this.subtitle = new Text(data.subtitle);
        this.strapline_text_one = new Text(data.straplineTextOne);
        this.strapline_thumbnail = Parser.parseItem(data.straplineThumbnail, MusicThumbnail);
        this.second_subtitle = new Text(data.secondSubtitle);
        if (Reflect.has(data, 'subtitleBadge')) {
            this.subtitle_badge = Parser.parseArray(data.subtitleBadge, MusicInlineBadge);
        }
        if (Reflect.has(data, 'description')) {
            this.description = Parser.parseItem(data.description, MusicDescriptionShelf);
        }
    }
}
MusicResponsiveHeader.type = 'MusicResponsiveHeader';
export default MusicResponsiveHeader;
//# sourceMappingURL=MusicResponsiveHeader.js.map