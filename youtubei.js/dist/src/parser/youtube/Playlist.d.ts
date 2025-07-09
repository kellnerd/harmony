import Feed from '../../core/mixins/Feed.js';
import Message from '../classes/Message.js';
import ReelItem from '../classes/ReelItem.js';
import ShortsLockupView from '../classes/ShortsLockupView.js';
import PlaylistVideo from '../classes/PlaylistVideo.js';
import { type ObservedArray, type YTNode } from '../helpers.js';
import type { Actions, ApiResponse } from '../../core/index.js';
import type { IBrowseResponse } from '../types/index.js';
import type Thumbnail from '../classes/misc/Thumbnail.js';
import type NavigationEndpoint from '../classes/NavigationEndpoint.js';
export default class Playlist extends Feed<IBrowseResponse> {
    #private;
    info: {
        subtitle: import("../misc.js").Text | null;
        author: import("../misc.js").Author;
        thumbnails: Thumbnail[];
        total_items: string;
        views: string;
        last_updated: string;
        can_share: boolean;
        can_delete: boolean;
        can_reorder: boolean;
        is_editable: boolean;
        privacy: string;
        title?: string | undefined;
        description?: string | undefined;
        type?: string | undefined;
    };
    menu: YTNode;
    endpoint?: NavigationEndpoint;
    messages: ObservedArray<Message>;
    constructor(actions: Actions, data: ApiResponse | IBrowseResponse, already_parsed?: boolean);
    get items(): ObservedArray<PlaylistVideo | ReelItem | ShortsLockupView>;
    get has_continuation(): boolean;
    getContinuationData(): Promise<IBrowseResponse | undefined>;
    getContinuation(): Promise<Playlist>;
}
