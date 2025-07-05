import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
export default class MenuServiceItemDownload extends YTNode {
    static type: string;
    has_separator: boolean;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
