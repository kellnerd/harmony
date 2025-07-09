import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
class IncludingResultsFor extends YTNode {
    constructor(data) {
        super();
        this.including_results_for = new Text(data.includingResultsFor);
        this.corrected_query = new Text(data.correctedQuery);
        this.corrected_query_endpoint = new NavigationEndpoint(data.correctedQueryEndpoint);
        this.search_only_for = Reflect.has(data, 'searchOnlyFor') ? new Text(data.searchOnlyFor) : undefined;
        this.original_query = Reflect.has(data, 'originalQuery') ? new Text(data.originalQuery) : undefined;
        this.original_query_endpoint = Reflect.has(data, 'originalQueryEndpoint') ? new NavigationEndpoint(data.originalQueryEndpoint) : undefined;
    }
}
IncludingResultsFor.type = 'IncludingResultsFor';
export default IncludingResultsFor;
//# sourceMappingURL=IncludingResultsFor.js.map