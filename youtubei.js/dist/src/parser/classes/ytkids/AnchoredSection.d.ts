import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
import SectionList from '../SectionList.js';
export default class AnchoredSection extends YTNode {
    static type: string;
    title: string;
    content: SectionList | null;
    endpoint: NavigationEndpoint;
    category_assets: {
        asset_key: string;
        background_color: string;
    };
    category_type: string;
    constructor(data: RawNode);
}
