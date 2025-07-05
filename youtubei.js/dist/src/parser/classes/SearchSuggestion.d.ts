import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class SearchSuggestion extends YTNode {
    static type: string;
    suggestion: Text;
    endpoint: NavigationEndpoint;
    icon_type?: string;
    service_endpoint?: NavigationEndpoint;
    constructor(data: RawNode);
}
