import type { RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class GuideCollapsibleSectionEntry extends YTNode {
    static type: string;
    header_entry: YTNode;
    expander_icon: string;
    collapser_icon: string;
    section_items: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
