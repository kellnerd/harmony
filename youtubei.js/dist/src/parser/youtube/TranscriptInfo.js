var _TranscriptInfo_page, _TranscriptInfo_actions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser } from '../index.js';
import Transcript from '../classes/Transcript.js';
class TranscriptInfo {
    constructor(actions, response) {
        _TranscriptInfo_page.set(this, void 0);
        _TranscriptInfo_actions.set(this, void 0);
        __classPrivateFieldSet(this, _TranscriptInfo_page, Parser.parseResponse(response.data), "f");
        __classPrivateFieldSet(this, _TranscriptInfo_actions, actions, "f");
        if (!__classPrivateFieldGet(this, _TranscriptInfo_page, "f").actions_memo)
            throw new Error('Page actions not found');
        this.transcript = __classPrivateFieldGet(this, _TranscriptInfo_page, "f").actions_memo.getType(Transcript)[0];
    }
    /**
     * Selects a language from the language menu and returns the updated transcript.
     * @param language - Language to select.
     */
    async selectLanguage(language) {
        const target_menu_item = this.transcript.content?.footer?.language_menu?.sub_menu_items?.find((item) => item.title.toString() === language);
        if (!target_menu_item)
            throw new Error(`Language not found: ${language}`);
        if (target_menu_item.selected)
            return this;
        const response = await __classPrivateFieldGet(this, _TranscriptInfo_actions, "f").execute('/get_transcript', {
            params: target_menu_item.continuation
        });
        return new TranscriptInfo(__classPrivateFieldGet(this, _TranscriptInfo_actions, "f"), response);
    }
    /**
     * Returns available languages.
     */
    get languages() {
        return this.transcript.content?.footer?.language_menu?.sub_menu_items?.map((item) => item.title.toString()) || [];
    }
    /**
     * Returns the currently selected language.
     */
    get selectedLanguage() {
        return this.transcript.content?.footer?.language_menu?.sub_menu_items?.find((item) => item.selected)?.title.toString() || '';
    }
    get page() {
        return __classPrivateFieldGet(this, _TranscriptInfo_page, "f");
    }
}
_TranscriptInfo_page = new WeakMap(), _TranscriptInfo_actions = new WeakMap();
export default TranscriptInfo;
//# sourceMappingURL=TranscriptInfo.js.map