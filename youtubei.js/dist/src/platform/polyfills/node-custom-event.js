var _CustomEvent_detail;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
// See https://github.com/nodejs/node/issues/40678#issuecomment-1126944677
class CustomEvent extends Event {
    constructor(type, options) {
        super(type, options);
        _CustomEvent_detail.set(this, void 0);
        __classPrivateFieldSet(this, _CustomEvent_detail, options?.detail ?? null, "f");
    }
    get detail() {
        return __classPrivateFieldGet(this, _CustomEvent_detail, "f");
    }
}
_CustomEvent_detail = new WeakMap();
export default CustomEvent;
//# sourceMappingURL=node-custom-event.js.map