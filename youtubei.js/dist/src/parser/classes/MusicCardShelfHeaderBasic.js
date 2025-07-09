import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class MusicCardShelfHeaderBasic extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
    }
}
MusicCardShelfHeaderBasic.type = 'MusicCardShelfHeaderBasic';
export default MusicCardShelfHeaderBasic;
//# sourceMappingURL=MusicCardShelfHeaderBasic.js.map