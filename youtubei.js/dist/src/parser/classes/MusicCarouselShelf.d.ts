import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import MusicCarouselShelfBasicHeader from './MusicCarouselShelfBasicHeader.js';
import MusicMultiRowListItem from './MusicMultiRowListItem.js';
import MusicNavigationButton from './MusicNavigationButton.js';
import MusicResponsiveListItem from './MusicResponsiveListItem.js';
import MusicTwoRowItem from './MusicTwoRowItem.js';
export default class MusicCarouselShelf extends YTNode {
    static type: string;
    header: MusicCarouselShelfBasicHeader | null;
    contents: ObservedArray<MusicTwoRowItem | MusicResponsiveListItem | MusicMultiRowListItem | MusicNavigationButton>;
    num_items_per_column?: number;
    constructor(data: RawNode);
}
