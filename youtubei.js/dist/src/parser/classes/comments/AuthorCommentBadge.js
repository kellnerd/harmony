var _AuthorCommentBadge_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
class AuthorCommentBadge extends YTNode {
    constructor(data) {
        super();
        _AuthorCommentBadge_data.set(this, void 0);
        if (Reflect.has(data, 'icon') && Reflect.has(data.icon, 'iconType')) {
            this.icon_type = data.icon.iconType;
        }
        this.tooltip = data.iconTooltip;
        // *** For consistency
        if (this.tooltip === 'Verified') {
            this.style = 'BADGE_STYLE_TYPE_VERIFIED';
            data.style = 'BADGE_STYLE_TYPE_VERIFIED';
        }
        __classPrivateFieldSet(this, _AuthorCommentBadge_data, data, "f");
    }
    get orig_badge() {
        return __classPrivateFieldGet(this, _AuthorCommentBadge_data, "f");
    }
}
_AuthorCommentBadge_data = new WeakMap();
AuthorCommentBadge.type = 'AuthorCommentBadge';
export default AuthorCommentBadge;
//# sourceMappingURL=AuthorCommentBadge.js.map