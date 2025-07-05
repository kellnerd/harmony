var _TabbedFeed_actions, _TabbedFeed_tabs;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Feed } from './index.js';
import { InnertubeError } from '../../utils/Utils.js';
import Tab from '../../parser/classes/Tab.js';
class TabbedFeed extends Feed {
    constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
        _TabbedFeed_actions.set(this, void 0);
        _TabbedFeed_tabs.set(this, void 0);
        __classPrivateFieldSet(this, _TabbedFeed_actions, actions, "f");
        __classPrivateFieldSet(this, _TabbedFeed_tabs, this.page.contents_memo?.getType(Tab), "f");
    }
    get tabs() {
        return __classPrivateFieldGet(this, _TabbedFeed_tabs, "f")?.map((tab) => tab.title.toString()) ?? [];
    }
    async getTabByName(title) {
        const tab = __classPrivateFieldGet(this, _TabbedFeed_tabs, "f")?.find((tab) => tab.title.toLowerCase() === title.toLowerCase());
        if (!tab)
            throw new InnertubeError(`Tab "${title}" not found`);
        if (tab.selected)
            return this;
        const response = await tab.endpoint.call(__classPrivateFieldGet(this, _TabbedFeed_actions, "f"));
        return new TabbedFeed(__classPrivateFieldGet(this, _TabbedFeed_actions, "f"), response, false);
    }
    async getTabByURL(url) {
        const tab = __classPrivateFieldGet(this, _TabbedFeed_tabs, "f")?.find((tab) => tab.endpoint.metadata.url?.split('/').pop() === url);
        if (!tab)
            throw new InnertubeError(`Tab "${url}" not found`);
        if (tab.selected)
            return this;
        const response = await tab.endpoint.call(__classPrivateFieldGet(this, _TabbedFeed_actions, "f"));
        return new TabbedFeed(__classPrivateFieldGet(this, _TabbedFeed_actions, "f"), response, false);
    }
    hasTabWithURL(url) {
        return __classPrivateFieldGet(this, _TabbedFeed_tabs, "f")?.some((tab) => tab.endpoint.metadata.url?.split('/').pop() === url) ?? false;
    }
    get title() {
        return this.page.contents_memo?.getType(Tab)?.find((tab) => tab.selected)?.title.toString();
    }
}
_TabbedFeed_actions = new WeakMap(), _TabbedFeed_tabs = new WeakMap();
export default TabbedFeed;
//# sourceMappingURL=TabbedFeed.js.map