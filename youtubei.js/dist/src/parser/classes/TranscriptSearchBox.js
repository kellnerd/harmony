import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { Text } from '../misc.js';
class TranscriptSearchBox extends YTNode {
    constructor(data) {
        super();
        this.formatted_placeholder = new Text(data.formattedPlaceholder);
        this.clear_button = Parser.parseItem(data.clearButton, Button);
        this.endpoint = new NavigationEndpoint(data.onTextChangeCommand);
        this.search_button = Parser.parseItem(data.searchButton, Button);
    }
}
TranscriptSearchBox.type = 'TranscriptSearchBox';
export default TranscriptSearchBox;
//# sourceMappingURL=TranscriptSearchBox.js.map