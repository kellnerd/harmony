import type { IBrowseResponse, IGetChallengeResponse, IGetNotificationsMenuResponse, INextResponse, IParsedResponse, IPlayerResponse, IRawResponse, IResolveURLResponse, ISearchResponse, IUpdatedMetadataResponse } from '../parser/index.js';
import type { Session } from './index.js';
export interface ApiResponse {
    success: boolean;
    status_code: number;
    data: IRawResponse;
}
export type InnertubeEndpoint = '/player' | '/search' | '/browse' | '/next' | '/reel' | '/updated_metadata' | '/notification/get_notification_menu' | '/att/get' | string;
export type ParsedResponse<T> = T extends '/player' ? IPlayerResponse : T extends '/search' ? ISearchResponse : T extends '/browse' ? IBrowseResponse : T extends '/next' ? INextResponse : T extends '/updated_metadata' ? IUpdatedMetadataResponse : T extends '/navigation/resolve_url' ? IResolveURLResponse : T extends '/notification/get_notification_menu' ? IGetNotificationsMenuResponse : T extends '/att/get' ? IGetChallengeResponse : IParsedResponse;
export default class Actions {
    #private;
    session: Session;
    constructor(session: Session);
    /**
     * Makes calls to the playback tracking API.
     * @param url - The URL to call.
     * @param client - The client to use.
     * @param params - Call parameters.
     */
    stats(url: string, client: {
        client_name: string;
        client_version: string;
    }, params: {
        [key: string]: any;
    }): Promise<Response>;
    /**
     * Executes an API call.
     * @param endpoint - The endpoint to call.
     * @param args - Call arguments
     */
    execute<T extends InnertubeEndpoint>(endpoint: T, args: {
        [key: string]: any;
        parse: true;
        protobuf?: false;
        serialized_data?: any;
        skip_auth_check?: boolean;
    }): Promise<ParsedResponse<T>>;
    execute<T extends InnertubeEndpoint>(endpoint: T, args?: {
        [key: string]: any;
        parse?: false;
        protobuf?: true;
        serialized_data?: any;
        skip_auth_check?: boolean;
    }): Promise<ApiResponse>;
}
