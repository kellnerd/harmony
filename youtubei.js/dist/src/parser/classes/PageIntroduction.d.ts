import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class PageIntroduction extends YTNode {
    static type: string;
    header_text: string;
    body_text: string;
    page_title: string;
    header_icon_type: string;
    constructor(data: RawNode);
}
