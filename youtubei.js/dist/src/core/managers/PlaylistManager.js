var _PlaylistManager_instances, _PlaylistManager_actions, _PlaylistManager_getPlaylist;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { InnertubeError, throwIfMissing } from '../../utils/Utils.js';
import Playlist from '../../parser/youtube/Playlist.js';
import NavigationEndpoint from '../../parser/classes/NavigationEndpoint.js';
class PlaylistManager {
    constructor(actions) {
        _PlaylistManager_instances.add(this);
        _PlaylistManager_actions.set(this, void 0);
        __classPrivateFieldSet(this, _PlaylistManager_actions, actions, "f");
    }
    /**
     * Creates a playlist.
     * @param title - The title of the playlist.
     * @param video_ids - An array of video IDs to add to the playlist.
     */
    async create(title, video_ids) {
        throwIfMissing({ title, video_ids });
        if (!__classPrivateFieldGet(this, _PlaylistManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const create_playlist_endpoint = new NavigationEndpoint({
            createPlaylistServiceEndpoint: {
                title,
                videoIds: video_ids
            }
        });
        const response = await create_playlist_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"));
        return {
            success: response.success,
            status_code: response.status_code,
            playlist_id: response.data.playlistId,
            data: response.data
        };
    }
    /**
     * Deletes a given playlist.
     * @param playlist_id - The playlist ID.
     */
    async delete(playlist_id) {
        throwIfMissing({ playlist_id });
        if (!__classPrivateFieldGet(this, _PlaylistManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const delete_playlist_endpoint = new NavigationEndpoint({
            deletePlaylistServiceEndpoint: {
                sourcePlaylistId: playlist_id
            }
        });
        const response = await delete_playlist_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"));
        return {
            playlist_id,
            success: response.success,
            status_code: response.status_code,
            data: response.data
        };
    }
    /**
     * Adds a given playlist to the library of a user.
     * @param playlist_id - The playlist ID.
     */
    async addToLibrary(playlist_id) {
        throwIfMissing({ playlist_id });
        if (!__classPrivateFieldGet(this, _PlaylistManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const like_playlist_endpoint = new NavigationEndpoint({
            likeEndpoint: {
                status: 'LIKE',
                target: playlist_id
            }
        });
        return await like_playlist_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"));
    }
    /**
     * Remove a given playlist to the library of a user.
     * @param playlist_id - The playlist ID.
     */
    async removeFromLibrary(playlist_id) {
        throwIfMissing({ playlist_id });
        if (!__classPrivateFieldGet(this, _PlaylistManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const remove_like_playlist_endpoint = new NavigationEndpoint({
            likeEndpoint: {
                status: 'INDIFFERENT',
                target: playlist_id
            }
        });
        return await remove_like_playlist_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"));
    }
    /**
     * Adds videos to a given playlist.
     * @param playlist_id - The playlist ID.
     * @param video_ids - An array of video IDs to add to the playlist.
     */
    async addVideos(playlist_id, video_ids) {
        throwIfMissing({ playlist_id, video_ids });
        if (!__classPrivateFieldGet(this, _PlaylistManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const playlist_edit_endpoint = new NavigationEndpoint({
            playlistEditEndpoint: {
                playlistId: playlist_id,
                actions: video_ids.map((id) => ({
                    action: 'ACTION_ADD_VIDEO',
                    addedVideoId: id
                }))
            }
        });
        const response = await playlist_edit_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"));
        return {
            playlist_id,
            action_result: response.data.actions // TODO: implement actions in the parser
        };
    }
    /**
     * Removes videos from a given playlist.
     * @param playlist_id - The playlist ID.
     * @param video_ids - An array of video IDs to remove from the playlist.
     * @param use_set_video_ids - Option to remove videos using set video IDs.
     */
    async removeVideos(playlist_id, video_ids, use_set_video_ids = false) {
        throwIfMissing({ playlist_id, video_ids });
        if (!__classPrivateFieldGet(this, _PlaylistManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const playlist = await __classPrivateFieldGet(this, _PlaylistManager_instances, "m", _PlaylistManager_getPlaylist).call(this, playlist_id);
        if (!playlist.info.is_editable)
            throw new InnertubeError('This playlist cannot be edited.', playlist_id);
        const payload = { playlistId: playlist_id, actions: [] };
        const getSetVideoIds = async (pl) => {
            const key_id = use_set_video_ids ? 'set_video_id' : 'id';
            const videos = pl.videos.filter((video) => video_ids.includes(video.key(key_id).string()));
            videos.forEach((video) => payload.actions.push({
                action: 'ACTION_REMOVE_VIDEO',
                setVideoId: video.key('set_video_id').string()
            }));
            if (payload.actions.length < video_ids.length) {
                const next = await pl.getContinuation();
                return getSetVideoIds(next);
            }
        };
        await getSetVideoIds(playlist);
        if (!payload.actions.length)
            throw new InnertubeError('Given video ids were not found in this playlist.', video_ids);
        const playlist_edit_endpoint = new NavigationEndpoint({ playlistEditEndpoint: payload });
        const response = await playlist_edit_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"));
        return {
            playlist_id,
            action_result: response.data.actions // TODO: implement actions in the parser
        };
    }
    /**
     * Moves a video to a new position within a given playlist.
     * @param playlist_id - The playlist ID.
     * @param moved_video_id - The video ID to move.
     * @param predecessor_video_id - The video ID to move the moved video before.
     */
    async moveVideo(playlist_id, moved_video_id, predecessor_video_id) {
        throwIfMissing({ playlist_id, moved_video_id, predecessor_video_id });
        if (!__classPrivateFieldGet(this, _PlaylistManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const playlist = await __classPrivateFieldGet(this, _PlaylistManager_instances, "m", _PlaylistManager_getPlaylist).call(this, playlist_id);
        if (!playlist.info.is_editable)
            throw new InnertubeError('This playlist cannot be edited.', playlist_id);
        const payload = { playlistId: playlist_id, actions: [] };
        let set_video_id_0, set_video_id_1;
        const getSetVideoIds = async (pl) => {
            const video_0 = pl.videos.find((video) => moved_video_id === video.key('id').string());
            const video_1 = pl.videos.find((video) => predecessor_video_id === video.key('id').string());
            set_video_id_0 = set_video_id_0 || video_0?.key('set_video_id').string();
            set_video_id_1 = set_video_id_1 || video_1?.key('set_video_id').string();
            if (!set_video_id_0 || !set_video_id_1) {
                const next = await pl.getContinuation();
                return getSetVideoIds(next);
            }
        };
        await getSetVideoIds(playlist);
        payload.actions.push({
            action: 'ACTION_MOVE_VIDEO_AFTER',
            setVideoId: set_video_id_0,
            movedSetVideoIdPredecessor: set_video_id_1
        });
        const playlist_edit_endpoint = new NavigationEndpoint({ playlistEditEndpoint: payload });
        const response = await playlist_edit_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"));
        return {
            playlist_id,
            action_result: response.data.actions // TODO: implement actions in the parser
        };
    }
    /**
     * Sets the name for the given playlist.
     * @param playlist_id - The playlist ID.
     * @param name - The name / title to use for the playlist.
     */
    async setName(playlist_id, name) {
        throwIfMissing({ playlist_id, name });
        if (!__classPrivateFieldGet(this, _PlaylistManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const payload = { playlist_id, actions: [] };
        payload.actions.push({
            action: 'ACTION_SET_PLAYLIST_NAME',
            playlistName: name
        });
        const playlist_edit_endpoint = new NavigationEndpoint({ playlistEditEndpoint: payload });
        const response = await playlist_edit_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"));
        return {
            playlist_id,
            action_result: response.data.actions
        };
    }
    /**
     * Sets the description for the given playlist.
     * @param playlist_id - The playlist ID.
     * @param description - The description to use for the playlist.
     */
    async setDescription(playlist_id, description) {
        throwIfMissing({ playlist_id, description });
        if (!__classPrivateFieldGet(this, _PlaylistManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const payload = { playlistId: playlist_id, actions: [] };
        payload.actions.push({
            action: 'ACTION_SET_PLAYLIST_DESCRIPTION',
            playlistDescription: description
        });
        const playlist_edit_endpoint = new NavigationEndpoint({ playlistEditEndpoint: payload });
        const response = await playlist_edit_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"));
        return {
            playlist_id,
            action_result: response.data.actions
        };
    }
}
_PlaylistManager_actions = new WeakMap(), _PlaylistManager_instances = new WeakSet(), _PlaylistManager_getPlaylist = async function _PlaylistManager_getPlaylist(playlist_id) {
    if (!playlist_id.startsWith('VL')) {
        playlist_id = `VL${playlist_id}`;
    }
    const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: playlist_id } });
    const browse_response = await browse_endpoint.call(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"), { parse: true });
    return new Playlist(__classPrivateFieldGet(this, _PlaylistManager_actions, "f"), browse_response, true);
};
export default PlaylistManager;
//# sourceMappingURL=PlaylistManager.js.map