import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
import SearchRefinementCard from './SearchRefinementCard.js';
import Button from './Button.js';
import MacroMarkersListItem from './MacroMarkersListItem.js';
import GameCard from './GameCard.js';
import VideoCard from './VideoCard.js';
import VideoAttributeView from './VideoAttributeView.js';
export default class HorizontalCardList extends YTNode {
    static type: string;
    cards: ObservedArray<VideoAttributeView | SearchRefinementCard | MacroMarkersListItem | GameCard | VideoCard>;
    header: YTNode;
    previous_button: Button | null;
    next_button: Button | null;
    constructor(data: RawNode);
}
