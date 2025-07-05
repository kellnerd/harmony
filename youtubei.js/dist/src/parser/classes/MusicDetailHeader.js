import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class MusicDetailHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.description = new Text(data.description);
        this.subtitle = new Text(data.subtitle);
        this.second_subtitle = new Text(data.secondSubtitle);
        this.year = this.subtitle.runs?.find((run) => (/^[12][0-9]{3}$/).test(run.text))?.text || '';
        this.song_count = this.second_subtitle.runs?.[0]?.text || '';
        this.total_duration = this.second_subtitle.runs?.[2]?.text || '';
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail.croppedSquareThumbnailRenderer.thumbnail);
        this.badges = Parser.parseArray(data.subtitleBadges);
        const author = this.subtitle.runs?.find((run) => run?.endpoint?.payload?.browseId.startsWith('UC'));
        if (author) {
            this.author = {
                name: author.text,
                channel_id: author.endpoint?.payload?.browseId,
                endpoint: author.endpoint
            };
        }
        this.menu = Parser.parseItem(data.menu);
    }
}
MusicDetailHeader.type = 'MusicDetailHeader';
export default MusicDetailHeader;
//# sourceMappingURL=MusicDetailHeader.js.map