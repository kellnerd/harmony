import Text from '../misc/Text.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class KidsCategoryTab extends YTNode {
    static type: string;
    title: Text;
    category_assets: {
        asset_key: string;
        background_color: string;
    };
    category_type: string;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
