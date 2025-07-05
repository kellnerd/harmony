import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import EndScreenPlaylist from './EndScreenPlaylist.js';
import EndScreenVideo from './EndScreenVideo.js';
import Text from './misc/Text.js';
class WatchNextEndScreen extends YTNode {
    constructor(data) {
        super();
        this.results = Parser.parseArray(data.results, [EndScreenVideo, EndScreenPlaylist]);
        this.title = new Text(data.title).toString();
    }
}
WatchNextEndScreen.type = 'WatchNextEndScreen';
export default WatchNextEndScreen;
//# sourceMappingURL=WatchNextEndScreen.js.map