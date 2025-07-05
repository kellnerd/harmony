import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
class SearchSuggestionsSection extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents);
    }
}
SearchSuggestionsSection.type = 'SearchSuggestionsSection';
export default SearchSuggestionsSection;
//# sourceMappingURL=SearchSuggestionsSection.js.map