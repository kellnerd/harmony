import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
export default class AddToPlaylistCommand extends YTNode {
    static type: string;
    open_miniplayer: boolean;
    video_id: string;
    list_type: string;
    endpoint: NavigationEndpoint;
    video_ids: string[];
    constructor(data: RawNode);
}
