var _Studio_instances, _Studio_session, _Studio_getInitialUploadData, _Studio_uploadVideo, _Studio_setVideoMetadata;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Constants } from '../../utils/index.js';
import { InnertubeError, Platform } from '../../utils/Utils.js';
import { MetadataUpdateRequest } from '../../../protos/generated/youtube/api/pfiinnertube/metadata_update_request.js';
class Studio {
    constructor(session) {
        _Studio_instances.add(this);
        _Studio_session.set(this, void 0);
        __classPrivateFieldSet(this, _Studio_session, session, "f");
    }
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
    async updateVideoMetadata(video_id, metadata) {
        const session = __classPrivateFieldGet(this, _Studio_session, "f");
        if (!session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const payload = {
            context: {
                client: {
                    osName: 'Android',
                    clientName: parseInt(Constants.CLIENT_NAME_IDS.ANDROID),
                    clientVersion: Constants.CLIENTS.ANDROID.VERSION,
                    androidSdkVersion: Constants.CLIENTS.ANDROID.SDK_VERSION,
                    visitorData: session.context.client.visitorData,
                    osVersion: '13',
                    acceptLanguage: session.context.client.hl,
                    acceptRegion: session.context.client.gl,
                    deviceMake: 'Google',
                    deviceModel: 'sdk_gphone64_x86_64',
                    screenHeightPoints: 840,
                    screenWidthPoints: 432,
                    configInfo: {
                        appInstallData: session.context.client.configInfo?.appInstallData
                    },
                    timeZone: session.context.client.timeZone,
                    chipset: 'qcom;taro'
                },
                activePlayers: []
            },
            encryptedVideoId: video_id
        };
        if (metadata.title)
            payload.title = { newTitle: metadata.title };
        if (metadata.description)
            payload.description = { newDescription: metadata.description };
        if (metadata.license)
            payload.license = { newLicenseId: metadata.license };
        if (metadata.tags)
            payload.tags = { newTags: metadata.tags };
        if (metadata.thumbnail) {
            payload.videoStill = {
                operation: 3,
                image: {
                    rawBytes: metadata.thumbnail
                },
                experimentImage: []
            };
        }
        if (Reflect.has(metadata, 'category'))
            payload.category = { newCategoryId: metadata.category };
        if (Reflect.has(metadata, 'privacy')) {
            switch (metadata.privacy) {
                case 'PUBLIC':
                    payload.privacy = { newPrivacy: 1 };
                    break;
                case 'UNLISTED':
                    payload.privacy = { newPrivacy: 2 };
                    break;
                case 'PRIVATE':
                    payload.privacy = { newPrivacy: 3 };
                    break;
                default:
                    throw new Error('Invalid privacy setting');
            }
        }
        if (Reflect.has(metadata, 'made_for_kids')) {
            payload.madeForKids = {
                operation: 1,
                newMfk: metadata.made_for_kids ? 1 : 2
            };
        }
        if (Reflect.has(metadata, 'age_restricted')) {
            payload.racy = {
                operation: 1,
                newRacy: metadata.age_restricted ? 1 : 2
            };
        }
        const writer = MetadataUpdateRequest.encode(payload);
        return await session.actions.execute('/video_manager/metadata_update', {
            protobuf: true,
            serialized_data: writer.finish()
        });
    }
    /**
     * Uploads a video to YouTube.
     * @example
     * ```ts
     * const file = fs.readFileSync('./my_awesome_video.mp4');
     * const response = await yt.studio.upload(file.buffer, { title: 'Wow!' });
     * ```
     */
    async upload(file, metadata = {}) {
        if (!__classPrivateFieldGet(this, _Studio_session, "f").logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const initial_data = await __classPrivateFieldGet(this, _Studio_instances, "m", _Studio_getInitialUploadData).call(this);
        const upload_result = await __classPrivateFieldGet(this, _Studio_instances, "m", _Studio_uploadVideo).call(this, initial_data.upload_url, file);
        if (upload_result.status !== 'STATUS_SUCCESS')
            throw new InnertubeError('Could not process video.');
        return await __classPrivateFieldGet(this, _Studio_instances, "m", _Studio_setVideoMetadata).call(this, initial_data, upload_result, metadata);
    }
}
_Studio_session = new WeakMap(), _Studio_instances = new WeakSet(), _Studio_getInitialUploadData = async function _Studio_getInitialUploadData() {
    const frontend_upload_id = `innertube_android:${Platform.shim.uuidv4()}:0:v=3,api=1,cf=3`;
    const payload = {
        frontendUploadId: frontend_upload_id,
        deviceDisplayName: 'Pixel 6 Pro',
        fileId: `goog-edited-video://generated?videoFileUri=content://media/external/video/media/${Platform.shim.uuidv4()}`,
        mp4MoovAtomRelocationStatus: 'UNSUPPORTED',
        transcodeResult: 'DISABLED',
        connectionType: 'WIFI'
    };
    const response = await __classPrivateFieldGet(this, _Studio_session, "f").http.fetch('/upload/youtubei', {
        baseURL: Constants.URLS.YT_UPLOAD,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-goog-upload-command': 'start',
            'x-goog-upload-protocol': 'resumable'
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok)
        throw new InnertubeError('Could not get initial upload data');
    return {
        frontend_upload_id,
        upload_id: response.headers.get('x-guploader-uploadid'),
        upload_url: response.headers.get('x-goog-upload-url'),
        scotty_resource_id: response.headers.get('x-goog-upload-header-scotty-resource-id'),
        chunk_granularity: response.headers.get('x-goog-upload-chunk-granularity')
    };
}, _Studio_uploadVideo = async function _Studio_uploadVideo(upload_url, file) {
    const response = await __classPrivateFieldGet(this, _Studio_session, "f").http.fetch_function(upload_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-goog-upload-command': 'upload, finalize',
            'x-goog-upload-file-name': `file-${Date.now()}`,
            'x-goog-upload-offset': '0'
        },
        body: file
    });
    if (!response.ok)
        throw new InnertubeError('Could not upload video');
    return await response.json();
}, _Studio_setVideoMetadata = async function _Studio_setVideoMetadata(initial_data, upload_result, metadata) {
    return await __classPrivateFieldGet(this, _Studio_session, "f").actions.execute('/upload/createvideo', {
        resourceId: {
            scottyResourceId: {
                id: upload_result.scottyResourceId
            }
        },
        frontendUploadId: initial_data.frontend_upload_id,
        initialMetadata: {
            title: {
                newTitle: metadata.title
            },
            description: {
                newDescription: metadata.description,
                shouldSegment: true
            },
            privacy: {
                newPrivacy: metadata.privacy || 'PRIVATE'
            },
            draftState: {
                isDraft: !!metadata.is_draft
            }
        }
    });
};
export default Studio;
//# sourceMappingURL=Studio.js.map