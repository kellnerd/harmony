var _TwoColumnWatchNextResults_instances, _TwoColumnWatchNextResults_parseAutoplaySet;
import { __classPrivateFieldGet } from "tslib";
import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
class TwoColumnWatchNextResults extends YTNode {
    constructor(data) {
        super();
        _TwoColumnWatchNextResults_instances.add(this);
        this.results = Parser.parseArray(data.results?.results.contents);
        this.secondary_results = Parser.parseArray(data.secondaryResults?.secondaryResults.results);
        this.conversation_bar = Parser.parseItem(data?.conversationBar);
        const playlistData = data.playlist?.playlist;
        if (playlistData) {
            this.playlist = {
                id: playlistData.playlistId,
                title: playlistData.title,
                author: playlistData.shortBylineText?.simpleText ?
                    new Text(playlistData.shortBylineText) :
                    new Author(playlistData.longBylineText),
                contents: Parser.parseArray(playlistData.contents),
                current_index: playlistData.currentIndex,
                is_infinite: !!playlistData.isInfinite,
                menu: Parser.parseItem(playlistData.menu, Menu)
            };
        }
        const autoplayData = data.autoplay?.autoplay;
        if (autoplayData) {
            this.autoplay = {
                sets: autoplayData.sets.map((set) => __classPrivateFieldGet(this, _TwoColumnWatchNextResults_instances, "m", _TwoColumnWatchNextResults_parseAutoplaySet).call(this, set))
            };
            if (autoplayData.modifiedSets) {
                this.autoplay.modified_sets = autoplayData.modifiedSets.map((set) => __classPrivateFieldGet(this, _TwoColumnWatchNextResults_instances, "m", _TwoColumnWatchNextResults_parseAutoplaySet).call(this, set));
            }
            if (autoplayData.countDownSecs) {
                this.autoplay.count_down_secs = autoplayData.countDownSecs;
            }
        }
    }
}
_TwoColumnWatchNextResults_instances = new WeakSet(), _TwoColumnWatchNextResults_parseAutoplaySet = function _TwoColumnWatchNextResults_parseAutoplaySet(data) {
    const result = {
        autoplay_video: new NavigationEndpoint(data.autoplayVideo)
    };
    if (data.nextButtonVideo) {
        result.next_button_video = new NavigationEndpoint(data.nextButtonVideo);
    }
    return result;
};
TwoColumnWatchNextResults.type = 'TwoColumnWatchNextResults';
export default TwoColumnWatchNextResults;
//# sourceMappingURL=TwoColumnWatchNextResults.js.map