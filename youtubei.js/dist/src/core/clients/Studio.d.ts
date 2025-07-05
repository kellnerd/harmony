import type { UpdateVideoMetadataOptions, UploadedVideoMetadataOptions } from '../../types/Misc.js';
import type { ApiResponse, Session } from '../index.js';
export default class Studio {
    #private;
    constructor(session: Session);
    /**
     * Updates the metadata of a video.
     * @example
     * ```ts
     * const videoId = 'abcdefg';
     * const thumbnail = fs.readFileSync('./my_awesome_thumbnail.jpg');
     *
     * const response = await yt.studio.updateVideoMetadata(videoId, {
     *   tags: [ 'astronomy', 'NASA', 'APOD' ],
     *   title: 'Artemis Mission',
     *   description: 'A nicely written description...',
     *   category: 27,
     *   license: 'creative_commons',
     *   thumbnail,
     *   // ...
     * });
     * ```
     */
    updateVideoMetadata(video_id: string, metadata: UpdateVideoMetadataOptions): Promise<ApiResponse>;
    /**
     * Uploads a video to YouTube.
     * @example
     * ```ts
     * const file = fs.readFileSync('./my_awesome_video.mp4');
     * const response = await yt.studio.upload(file.buffer, { title: 'Wow!' });
     * ```
     */
    upload(file: BodyInit, metadata?: UploadedVideoMetadataOptions): Promise<ApiResponse>;
}
