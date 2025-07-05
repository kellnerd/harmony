import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import PageHeaderView from './PageHeaderView.js';
export default class PageHeader extends YTNode {
    static type: string;
    page_title: string;
    content: PageHeaderView | null;
    constructor(data: RawNode);
}
