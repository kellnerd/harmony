import Feed from '../../core/mixins/Feed.js';
import History from './History.js';
import Playlist from './Playlist.js';
import PageHeader from '../classes/PageHeader.js';
import type { Actions, ApiResponse } from '../../core/index.js';
import type { IBrowseResponse } from '../types/index.js';
export default class Library extends Feed<IBrowseResponse> {
    #private;
    header: PageHeader | null;
    sections: {
        type: string | undefined;
        title: import("../misc.js").Text;
        contents: any[];
        getAll: () => Promise<Feed<IBrowseResponse> | History | Playlist>;
    }[];
    constructor(actions: Actions, data: ApiResponse | IBrowseResponse);
    get history(): {
        type: string | undefined;
        title: import("../misc.js").Text;
        contents: any[];
        getAll: () => Promise<Feed<IBrowseResponse> | History | Playlist>;
    } | undefined;
    get watch_later(): {
        type: string | undefined;
        title: import("../misc.js").Text;
        contents: any[];
        getAll: () => Promise<Feed<IBrowseResponse> | History | Playlist>;
    } | undefined;
    get liked_videos(): {
        type: string | undefined;
        title: import("../misc.js").Text;
        contents: any[];
        getAll: () => Promise<Feed<IBrowseResponse> | History | Playlist>;
    } | undefined;
    get playlists_section(): {
        type: string | undefined;
        title: import("../misc.js").Text;
        contents: any[];
        getAll: () => Promise<Feed<IBrowseResponse> | History | Playlist>;
    } | undefined;
    get clips(): {
        type: string | undefined;
        title: import("../misc.js").Text;
        contents: any[];
        getAll: () => Promise<Feed<IBrowseResponse> | History | Playlist>;
    } | undefined;
}
