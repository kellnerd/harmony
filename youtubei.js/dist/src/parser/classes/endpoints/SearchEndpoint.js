var _SearchEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'search';
class SearchEndpoint extends YTNode {
    constructor(data) {
        super();
        _SearchEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _SearchEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _SearchEndpoint_data, "f").query)
            request.query = __classPrivateFieldGet(this, _SearchEndpoint_data, "f").query;
        if (__classPrivateFieldGet(this, _SearchEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _SearchEndpoint_data, "f").params;
        if (__classPrivateFieldGet(this, _SearchEndpoint_data, "f").webSearchboxStatsUrl)
            request.webSearchboxStatsUrl = __classPrivateFieldGet(this, _SearchEndpoint_data, "f").webSearchboxStatsUrl;
        if (__classPrivateFieldGet(this, _SearchEndpoint_data, "f").suggestStats)
            request.suggestStats = __classPrivateFieldGet(this, _SearchEndpoint_data, "f").suggestStats;
        return request;
    }
}
_SearchEndpoint_data = new WeakMap();
SearchEndpoint.type = 'SearchEndpoint';
export default SearchEndpoint;
//# sourceMappingURL=SearchEndpoint.js.map