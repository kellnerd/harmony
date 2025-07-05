import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import SecondarySearchContainer from './SecondarySearchContainer.js';
import RichGrid from './RichGrid.js';
import SectionList from './SectionList.js';
export default class TwoColumnSearchResults extends YTNode {
    static type: string;
    header: YTNode | null;
    primary_contents: RichGrid | SectionList | null;
    secondary_contents: SecondarySearchContainer | null;
    target_id?: string;
    constructor(data: RawNode);
}
