import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
class MusicDescriptionShelf extends YTNode {
    constructor(data) {
        super();
        this.description = new Text(data.description);
        if (Reflect.has(data, 'maxCollapsedLines')) {
            this.max_collapsed_lines = data.maxCollapsedLines;
        }
        if (Reflect.has(data, 'maxExpandedLines')) {
            this.max_expanded_lines = data.maxExpandedLines;
        }
        this.footer = new Text(data.footer);
    }
}
MusicDescriptionShelf.type = 'MusicDescriptionShelf';
export default MusicDescriptionShelf;
//# sourceMappingURL=MusicDescriptionShelf.js.map