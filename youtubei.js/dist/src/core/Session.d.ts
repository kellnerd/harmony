import OAuth2 from './OAuth2.js';
import { EventEmitter, HTTPClient } from '../utils/index.js';
import Actions from './Actions.js';
import Player from './Player.js';
import type { DeviceCategory } from '../utils/Utils.js';
import type { FetchFunction, ICache } from '../types/index.js';
import type { OAuth2Tokens, OAuth2AuthErrorEventHandler, OAuth2AuthPendingEventHandler, OAuth2AuthEventHandler } from './OAuth2.js';
export declare enum ClientType {
    WEB = "WEB",
    MWEB = "MWEB",
    KIDS = "WEB_KIDS",
    MUSIC = "WEB_REMIX",
    IOS = "iOS",
    ANDROID = "ANDROID",
    ANDROID_MUSIC = "ANDROID_MUSIC",
    ANDROID_CREATOR = "ANDROID_CREATOR",
    TV = "TVHTML5",
    TV_SIMPLY = "TVHTML5_SIMPLY",
    TV_EMBEDDED = "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
    WEB_EMBEDDED = "WEB_EMBEDDED_PLAYER",
    WEB_CREATOR = "WEB_CREATOR"
}
export type Context = {
    client: {
        hl: string;
        gl: string;
        remoteHost?: string;
        screenDensityFloat?: number;
        screenHeightPoints?: number;
        screenPixelDensity?: number;
        screenWidthPoints?: number;
        visitorData?: string;
        clientName: string;
        clientVersion: string;
        clientScreen?: string;
        androidSdkVersion?: number;
        osName: string;
        osVersion: string;
        platform: string;
        clientFormFactor: string;
        userInterfaceTheme?: string;
        timeZone: string;
        userAgent: string;
        browserName?: string;
        browserVersion?: string;
        originalUrl?: string;
        deviceMake: string;
        deviceModel: string;
        deviceExperimentId?: string;
        rolloutToken?: string;
        utcOffsetMinutes: number;
        mainAppWebInfo?: {
            graftUrl: string;
            pwaInstallabilityStatus: string;
            webDisplayMode: string;
            isWebNativeShareAvailable: boolean;
        };
        memoryTotalKbytes?: string;
        configInfo?: {
            appInstallData?: string;
            coldConfigData?: string;
            coldHashData?: string;
            hotHashData?: string;
        };
        kidsAppInfo?: {
            categorySettings: {
                enabledCategories: string[];
            };
            contentSettings: {
                corpusPreference: string;
                kidsNoSearchMode: string;
            };
        };
    };
    user: {
        enableSafetyMode: boolean;
        lockedSafetyMode: boolean;
        onBehalfOfUser?: string;
    };
    thirdParty?: {
        embedUrl: string;
    };
    request?: {
        useSsl: boolean;
        internalExperimentFlags: any[];
    };
};
type ContextData = {
    hl: string;
    gl: string;
    remote_host?: string;
    visitor_data: string;
    client_name: string;
    client_version: string;
    user_agent: string;
    os_name: string;
    os_version: string;
    device_category: string;
    time_zone: string;
    enable_safety_mode: boolean;
    browser_name?: string;
    browser_version?: string;
    app_install_data?: string;
    device_make: string;
    device_model: string;
    on_behalf_of_user?: string;
    device_experiment_id?: string;
    rollout_token?: string;
};
export type SessionOptions = {
    /**
     * Language.
     */
    lang?: string;
    /**
     * Geolocation.
     */
    location?: string;
    /**
     * User agent (InnerTube requests only).
     */
    user_agent?: string;
    /**
     * The account index to use. This is useful if you have multiple accounts logged in.
     *
     * **NOTE:** Only works if you are signed in with cookies.
     */
    account_index?: number;
    /**
     * Specify the Page ID of the YouTube profile/channel to use, if the logged-in account has multiple profiles.
     */
    on_behalf_of_user?: string;
    /**
     * Specifies whether to retrieve the JS player. Disabling this will make session creation faster.
     *
     * **NOTE:** Deciphering formats is not possible without the JS player.
     */
    retrieve_player?: boolean;
    /**
     * Specifies whether to enable safety mode. This will prevent the session from loading any potentially unsafe content.
     */
    enable_safety_mode?: boolean;
    /**
     * Specifies whether to retrieve the InnerTube config. Useful for "onesie" requests.
     */
    retrieve_innertube_config?: boolean;
    /**
     * Specifies whether to generate the session data locally or retrieve it from YouTube.
     * This can be useful if you need more performance.
     *
     * **NOTE:** If you are using the cache option and a session has already been generated, this will be ignored.
     * If you want to force a new session to be generated, you must clear the cache or disable session caching.
     */
    generate_session_locally?: boolean;
    /**
     * Specifies whether the session data should be cached.
     */
    enable_session_cache?: boolean;
    /**
     * Platform to use for the session.
     */
    device_category?: DeviceCategory;
    /**
     * InnerTube client type.
     */
    client_type?: ClientType;
    /**
     * The time zone.
     */
    timezone?: string;
    /**
     * Used to cache algorithms, session data, and OAuth2 tokens.
     */
    cache?: ICache;
    /**
     * YouTube cookies.
     */
    cookie?: string;
    /**
     * Setting this to a valid and persistent visitor data string will allow YouTube to give this session tailored content even when not logged in.
     * A good way to get a valid one is by either grabbing it from a browser or calling InnerTube's `/visitor_id` endpoint.
     */
    visitor_data?: string;
    /**
     * Fetch function to use.
     */
    fetch?: FetchFunction;
    /**
     * Proof of Origin Token. This is an attestation token generated by BotGuard/DroidGuard. It is used to confirm that the request is coming from a genuine client.
     */
    po_token?: string;
    /**
     * Player ID override.
     * In most cases, this isn't necessary; but when YouTube introduces breaking changes,
     * forcing an older Player ID can help work around temporary issues.
     */
    player_id?: string;
};
export type SessionData = {
    context: Context;
    api_key: string;
    api_version: string;
    config_data?: string;
};
export type SWSessionData = {
    context_data: ContextData;
    api_key: string;
    api_version: string;
};
export type SessionArgs = {
    lang: string;
    location: string;
    time_zone: string;
    user_agent: string;
    device_category: DeviceCategory;
    client_name: ClientType;
    enable_safety_mode: boolean;
    visitor_data: string;
    on_behalf_of_user: string | undefined;
};
/**
 * Represents an InnerTube session. This holds all the data needed to make requests to YouTube.
 */
export default class Session extends EventEmitter {
    #private;
    context: Context;
    api_key: string;
    api_version: string;
    account_index: number;
    config_data?: string | undefined;
    player?: Player | undefined;
    cookie?: string | undefined;
    cache?: ICache | undefined;
    po_token?: string | undefined;
    oauth: OAuth2;
    http: HTTPClient;
    logged_in: boolean;
    actions: Actions;
    user_agent?: string;
    constructor(context: Context, api_key: string, api_version: string, account_index: number, config_data?: string | undefined, player?: Player | undefined, cookie?: string | undefined, fetch?: FetchFunction, cache?: ICache | undefined, po_token?: string | undefined);
    on(type: 'auth', listener: OAuth2AuthEventHandler): void;
    on(type: 'auth-pending', listener: OAuth2AuthPendingEventHandler): void;
    on(type: 'auth-error', listener: OAuth2AuthErrorEventHandler): void;
    on(type: 'update-credentials', listener: OAuth2AuthEventHandler): void;
    once(type: 'auth', listener: OAuth2AuthEventHandler): void;
    once(type: 'auth-pending', listener: OAuth2AuthPendingEventHandler): void;
    once(type: 'auth-error', listener: OAuth2AuthErrorEventHandler): void;
    static create(options?: SessionOptions): Promise<Session>;
    /**
     * Retrieves session data from cache.
     * @param cache - A valid cache implementation.
     * @param session_args - User provided session arguments.
     */
    static fromCache(cache: ICache, session_args: SessionArgs): Promise<SessionData | null>;
    static getSessionData(lang?: string, location?: string, account_index?: number, visitor_data?: string, user_agent?: string, enable_safety_mode?: boolean, generate_session_locally?: boolean, device_category?: DeviceCategory, client_name?: ClientType, tz?: string, fetch?: FetchFunction, on_behalf_of_user?: string, cache?: ICache, enable_session_cache?: boolean, po_token?: string, retrieve_innertube_config?: boolean): Promise<{
        account_index: number;
        context: Context;
        api_key: string;
        api_version: string;
        config_data?: string | undefined;
    }>;
    signIn(credentials?: OAuth2Tokens): Promise<void>;
    /**
     * Signs out of the current account and revokes the credentials.
     */
    signOut(): Promise<Response | undefined>;
    get client_version(): string;
    get client_name(): string;
    get lang(): string;
}
export {};
