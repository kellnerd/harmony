import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import type { RawNode } from '../index.js';
export type PrivacyIcon = {
    icon_type: string | null;
};
export default class PlaylistAddToOption extends YTNode {
    static type: string;
    add_to_playlist_service_endpoint: NavigationEndpoint;
    contains_selected_videos: 'ALL' | 'NONE';
    playlist_id: string;
    privacy: string;
    privacy_icon: PrivacyIcon;
    remove_from_playlist_service_endpoint: NavigationEndpoint;
    title: Text;
    constructor(data: RawNode);
}
