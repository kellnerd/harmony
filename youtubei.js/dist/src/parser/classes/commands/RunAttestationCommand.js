import { YTNode } from '../../helpers.js';
class RunAttestationCommand extends YTNode {
    constructor(data) {
        super();
        this.engagement_type = data.engagementType;
        if (Reflect.has(data, 'ids')) {
            this.ids = data.ids.map((id) => ({
                encrypted_video_id: id.encryptedVideoId,
                external_channel_id: id.externalChannelId,
                comment_id: id.commentId,
                external_owner_id: id.externalOwnerId,
                artist_id: id.artistId,
                playlist_id: id.playlistId,
                external_post_id: id.externalPostId,
                share_id: id.shareId
            }));
        }
    }
}
RunAttestationCommand.type = 'RunAttestationCommand';
export default RunAttestationCommand;
//# sourceMappingURL=RunAttestationCommand.js.map