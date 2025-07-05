import Text from './misc/Text.js';
import Author from './misc/Author.js';
import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
export default class PlaylistHeader extends YTNode {
    static type: string;
    id: string;
    title: Text;
    subtitle: Text | null;
    stats: Text[];
    brief_stats: Text[];
    author: Author | null;
    description: Text;
    num_videos: Text;
    view_count: Text;
    can_share: boolean;
    can_delete: boolean;
    is_editable: boolean;
    privacy: string;
    save_button: YTNode;
    shuffle_play_button: YTNode;
    menu: YTNode;
    banner: YTNode;
    constructor(data: RawNode);
}
