import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class IncludingResultsFor extends YTNode {
    static type: string;
    including_results_for: Text;
    corrected_query: Text;
    corrected_query_endpoint: NavigationEndpoint;
    search_only_for?: Text;
    original_query?: Text;
    original_query_endpoint?: NavigationEndpoint;
    constructor(data: RawNode);
}
