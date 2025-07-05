import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
class SearchBox extends YTNode {
    constructor(data) {
        super();
        this.endpoint = new NavigationEndpoint(data.endpoint);
        this.search_button = Parser.parseItem(data.searchButton, Button);
        this.clear_button = Parser.parseItem(data.clearButton, Button);
        this.placeholder_text = new Text(data.placeholderText);
    }
}
SearchBox.type = 'SearchBox';
export default SearchBox;
//# sourceMappingURL=SearchBox.js.map