import type { Actions } from '../index.js';
export default class PlaylistManager {
    #private;
    constructor(actions: Actions);
    /**
     * Creates a playlist.
     * @param title - The title of the playlist.
     * @param video_ids - An array of video IDs to add to the playlist.
     */
    create(title: string, video_ids: string[]): Promise<{
        success: boolean;
        status_code: number;
        playlist_id?: string;
        data: any;
    }>;
    /**
     * Deletes a given playlist.
     * @param playlist_id - The playlist ID.
     */
    delete(playlist_id: string): Promise<{
        playlist_id: string;
        success: boolean;
        status_code: number;
        data: any;
    }>;
    /**
     * Adds a given playlist to the library of a user.
     * @param playlist_id - The playlist ID.
     */
    addToLibrary(playlist_id: string): Promise<import("../Actions.js").ApiResponse>;
    /**
     * Remove a given playlist to the library of a user.
     * @param playlist_id - The playlist ID.
     */
    removeFromLibrary(playlist_id: string): Promise<import("../Actions.js").ApiResponse>;
    /**
     * Adds videos to a given playlist.
     * @param playlist_id - The playlist ID.
     * @param video_ids - An array of video IDs to add to the playlist.
     */
    addVideos(playlist_id: string, video_ids: string[]): Promise<{
        playlist_id: string;
        action_result: any;
    }>;
    /**
     * Removes videos from a given playlist.
     * @param playlist_id - The playlist ID.
     * @param video_ids - An array of video IDs to remove from the playlist.
     * @param use_set_video_ids - Option to remove videos using set video IDs.
     */
    removeVideos(playlist_id: string, video_ids: string[], use_set_video_ids?: boolean): Promise<{
        playlist_id: string;
        action_result: any;
    }>;
    /**
     * Moves a video to a new position within a given playlist.
     * @param playlist_id - The playlist ID.
     * @param moved_video_id - The video ID to move.
     * @param predecessor_video_id - The video ID to move the moved video before.
     */
    moveVideo(playlist_id: string, moved_video_id: string, predecessor_video_id: string): Promise<{
        playlist_id: string;
        action_result: any;
    }>;
    /**
     * Sets the name for the given playlist.
     * @param playlist_id - The playlist ID.
     * @param name - The name / title to use for the playlist.
     */
    setName(playlist_id: string, name: string): Promise<{
        playlist_id: string;
        action_result: any;
    }>;
    /**
     * Sets the description for the given playlist.
     * @param playlist_id - The playlist ID.
     * @param description - The description to use for the playlist.
     */
    setDescription(playlist_id: string, description: string): Promise<{
        playlist_id: string;
        action_result: any;
    }>;
}
