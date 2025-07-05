import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class PlaylistPanelVideo extends YTNode {
    static type: string;
    title: Text;
    thumbnail: Thumbnail[];
    endpoint: NavigationEndpoint;
    selected: boolean;
    video_id: string;
    duration: {
        text: string;
        seconds: number;
    };
    author: string;
    album?: {
        id?: string;
        name: string;
        year?: string;
        endpoint?: NavigationEndpoint;
    };
    artists?: {
        name: string;
        channel_id?: string;
        endpoint?: NavigationEndpoint;
    }[];
    badges: ObservedArray<YTNode>;
    menu: YTNode;
    set_video_id?: string;
    constructor(data: RawNode);
}
