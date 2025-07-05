import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import MusicResponsiveListItem from './MusicResponsiveListItem.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
class MusicShelf extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.contents = Parser.parseArray(data.contents, MusicResponsiveListItem);
        if (Reflect.has(data, 'bottomEndpoint')) {
            this.endpoint = new NavigationEndpoint(data.bottomEndpoint);
        }
        if (Reflect.has(data, 'continuations')) {
            this.continuation =
                data.continuations?.[0].nextContinuationData?.continuation ||
                    data.continuations?.[0].reloadContinuationData?.continuation;
        }
        if (Reflect.has(data, 'bottomText')) {
            this.bottom_text = new Text(data.bottomText);
        }
        if (Reflect.has(data, 'bottomButton')) {
            this.bottom_button = Parser.parseItem(data.bottomButton, Button);
        }
        if (Reflect.has(data, 'subheaders')) {
            this.subheaders = Parser.parseArray(data.subheaders);
        }
    }
}
MusicShelf.type = 'MusicShelf';
export default MusicShelf;
//# sourceMappingURL=MusicShelf.js.map