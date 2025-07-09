import { YTNode } from '../helpers.js';
class PlayerLiveStoryboardSpec extends YTNode {
    constructor(data) {
        super();
        const [template_url, thumbnail_width, thumbnail_height, columns, rows] = data.spec.split('#');
        this.board = {
            type: 'live',
            template_url,
            thumbnail_width: parseInt(thumbnail_width, 10),
            thumbnail_height: parseInt(thumbnail_height, 10),
            columns: parseInt(columns, 10),
            rows: parseInt(rows, 10)
        };
    }
}
PlayerLiveStoryboardSpec.type = 'PlayerLiveStoryboardSpec';
export default PlayerLiveStoryboardSpec;
//# sourceMappingURL=PlayerLiveStoryboardSpec.js.map