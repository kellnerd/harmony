import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import SubFeedSelector from './SubFeedSelector.js';
import EomSettingsDisclaimer from './EomSettingsDisclaimer.js';
import ToggleButton from './ToggleButton.js';
import CompactLink from './CompactLink.js';
import SearchBox from './SearchBox.js';
import Button from './Button.js';
class BrowseFeedActions extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents, [SubFeedSelector, EomSettingsDisclaimer, ToggleButton, CompactLink, SearchBox, Button]);
    }
}
BrowseFeedActions.type = 'BrowseFeedActions';
export default BrowseFeedActions;
//# sourceMappingURL=BrowseFeedActions.js.map