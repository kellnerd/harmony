import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import type NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class MusicDetailHeader extends YTNode {
    static type: string;
    title: Text;
    description: Text;
    subtitle: Text;
    second_subtitle: Text;
    year: string;
    song_count: string;
    total_duration: string;
    thumbnails: Thumbnail[];
    badges: ObservedArray<YTNode>;
    author?: {
        name: string;
        channel_id: string | undefined;
        endpoint: NavigationEndpoint | undefined;
    };
    menu: YTNode;
    constructor(data: RawNode);
}
