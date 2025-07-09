var _GetKidsBlocklistPickerCommand_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'kids/get_kids_blocklist_picker';
class GetKidsBlocklistPickerCommand extends YTNode {
    constructor(data) {
        super();
        _GetKidsBlocklistPickerCommand_data.set(this, void 0);
        __classPrivateFieldSet(this, _GetKidsBlocklistPickerCommand_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _GetKidsBlocklistPickerCommand_data, "f").blockedForKidsContent)
            request.blockedForKidsContent = __classPrivateFieldGet(this, _GetKidsBlocklistPickerCommand_data, "f").blockedForKidsContent;
        return request;
    }
}
_GetKidsBlocklistPickerCommand_data = new WeakMap();
GetKidsBlocklistPickerCommand.type = 'GetKidsBlocklistPickerCommand';
export default GetKidsBlocklistPickerCommand;
//# sourceMappingURL=GetKidsBlocklistPickerCommand.js.map