import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
export default class MusicMultiSelectMenuItem extends YTNode {
    static type: string;
    title: string;
    form_item_entity_key: string;
    selected_icon_type?: string;
    endpoint?: NavigationEndpoint;
    selected: boolean;
    constructor(data: RawNode);
}
