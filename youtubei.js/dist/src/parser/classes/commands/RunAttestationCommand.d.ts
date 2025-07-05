import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../types/index.js';
export type AttIds = {
    encrypted_video_id?: string;
    external_channel_id?: string;
    comment_id?: string;
    external_owner_id?: string;
    artist_id?: string;
    playlist_id?: string;
    external_post_id?: string;
    share_id?: string;
};
export default class RunAttestationCommand extends YTNode {
    static type: string;
    engagement_type: string;
    ids?: AttIds[];
    constructor(data: RawNode);
}
