var _a, _Session_storeSession, _Session_getSessionData, _Session_buildContext, _Session_getVisitorID;
import { __classPrivateFieldGet } from "tslib";
import OAuth2 from './OAuth2.js';
import { Log, EventEmitter, HTTPClient, LZW, ProtoUtils } from '../utils/index.js';
import * as Constants from '../utils/Constants.js';
import Actions from './Actions.js';
import Player from './Player.js';
import { generateRandomString, getRandomUserAgent, InnertubeError, Platform, SessionError } from '../utils/Utils.js';
export const ClientType = {
    WEB: "WEB",
    MWEB: "MWEB",
    KIDS: "WEB_KIDS",
    MUSIC: "WEB_REMIX",
    IOS: "iOS",
    ANDROID: "ANDROID",
    ANDROID_MUSIC: "ANDROID_MUSIC",
    ANDROID_CREATOR: "ANDROID_CREATOR",
    TV: "TVHTML5",
    TV_SIMPLY: "TVHTML5_SIMPLY",
    TV_EMBEDDED: "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
    WEB_EMBEDDED: "WEB_EMBEDDED_PLAYER",
    WEB_CREATOR: "WEB_CREATOR"
};
const TAG = 'Session';
/**
 * Represents an InnerTube session. This holds all the data needed to make requests to YouTube.
 */
class Session extends EventEmitter {
    constructor(context, api_key, api_version, account_index, config_data, player, cookie, fetch, cache, po_token) {
        super();
        this.context = context;
        this.api_key = api_key;
        this.api_version = api_version;
        this.account_index = account_index;
        this.config_data = config_data;
        this.player = player;
        this.cookie = cookie;
        this.cache = cache;
        this.po_token = po_token;
        this.http = new HTTPClient(this, cookie, fetch);
        this.actions = new Actions(this);
        this.oauth = new OAuth2(this);
        this.logged_in = !!cookie;
        this.user_agent = context.client.userAgent;
    }
    on(type, listener) {
        super.on(type, listener);
    }
    once(type, listener) {
        super.once(type, listener);
    }
    static async create(options = {}) {
        const { context, api_key, api_version, account_index, config_data } = await _a.getSessionData(options.lang, options.location, options.account_index, options.visitor_data, options.user_agent, options.enable_safety_mode, options.generate_session_locally, options.device_category, options.client_type, options.timezone, options.fetch, options.on_behalf_of_user, options.cache, options.enable_session_cache, options.po_token, options.retrieve_innertube_config);
        return new _a(context, api_key, api_version, account_index, config_data, options.retrieve_player === false ? undefined : await Player.create(options.cache, options.fetch, options.po_token, options.player_id), options.cookie, options.fetch, options.cache, options.po_token);
    }
    /**
     * Retrieves session data from cache.
     * @param cache - A valid cache implementation.
     * @param session_args - User provided session arguments.
     */
    static async fromCache(cache, session_args) {
        const buffer = await cache.get('innertube_session_data');
        if (!buffer)
            return null;
        const data = new TextDecoder().decode(buffer.slice(4));
        try {
            const result = JSON.parse(LZW.decompress(data));
            if (session_args.visitor_data) {
                result.context.client.visitorData = session_args.visitor_data;
            }
            if (session_args.lang)
                result.context.client.hl = session_args.lang;
            if (session_args.location)
                result.context.client.gl = session_args.location;
            if (session_args.on_behalf_of_user)
                result.context.user.onBehalfOfUser = session_args.on_behalf_of_user;
            if (session_args.user_agent)
                result.context.client.userAgent = session_args.user_agent;
            if (session_args.client_name) {
                const client = Object.values(Constants.CLIENTS).find((c) => c.NAME === session_args.client_name);
                if (client) {
                    result.context.client.clientName = client.NAME;
                    result.context.client.clientVersion = client.VERSION;
                }
                else {
                    Log.warn(TAG, `Unknown client name: ${session_args.client_name}. Using default WEB client.`);
                    result.context.client.clientName = ClientType.WEB;
                    result.context.client.clientVersion = Constants.CLIENTS.WEB.VERSION;
                }
            }
            result.context.client.timeZone = session_args.time_zone;
            result.context.client.platform = session_args.device_category.toUpperCase();
            result.context.user.enableSafetyMode = session_args.enable_safety_mode;
            return result;
        }
        catch (error) {
            Log.error(TAG, 'Failed to parse session data from cache.', error);
            return null;
        }
    }
    static async getSessionData(lang = '', location = '', account_index = 0, visitor_data = '', user_agent = getRandomUserAgent('desktop'), enable_safety_mode = false, generate_session_locally = false, device_category = 'desktop', client_name = ClientType.WEB, tz = Intl.DateTimeFormat().resolvedOptions().timeZone, fetch = Platform.shim.fetch, on_behalf_of_user, cache, enable_session_cache = true, po_token, retrieve_innertube_config = true) {
        const session_args = {
            lang,
            location,
            time_zone: tz,
            user_agent,
            device_category,
            client_name,
            enable_safety_mode,
            visitor_data,
            on_behalf_of_user,
            po_token
        };
        let session_data;
        if (cache && enable_session_cache) {
            const cached_session_data = await this.fromCache(cache, session_args);
            if (cached_session_data) {
                Log.info(TAG, 'Found session data in cache.');
                session_data = cached_session_data;
            }
        }
        if (!session_data) {
            Log.info(TAG, 'Generating session data.');
            let api_key = Constants.CLIENTS.WEB.API_KEY;
            let api_version = Constants.CLIENTS.WEB.API_VERSION;
            let context_data = {
                hl: lang || 'en',
                gl: location || 'US',
                remote_host: '',
                user_agent: user_agent,
                visitor_data: visitor_data || ProtoUtils.encodeVisitorData(generateRandomString(11), Math.floor(Date.now() / 1000)),
                client_name: client_name,
                client_version: Object.values(Constants.CLIENTS).filter((v) => v.NAME === client_name)[0]?.VERSION ?? Constants.CLIENTS.WEB.VERSION,
                device_category: device_category.toUpperCase(),
                os_name: 'Windows',
                os_version: '10.0',
                time_zone: tz,
                browser_name: 'Chrome',
                browser_version: '125.0.0.0',
                device_make: '',
                device_model: '',
                enable_safety_mode: enable_safety_mode
            };
            if (!generate_session_locally) {
                try {
                    const sw_session_data = await __classPrivateFieldGet(this, _a, "m", _Session_getSessionData).call(this, session_args, fetch);
                    api_key = sw_session_data.api_key;
                    api_version = sw_session_data.api_version;
                    context_data = sw_session_data.context_data;
                }
                catch (error) {
                    Log.error(TAG, 'Failed to retrieve session data from server. Session data generated locally will be used instead.', error);
                }
            }
            if (on_behalf_of_user) {
                context_data.on_behalf_of_user = on_behalf_of_user;
            }
            session_data = {
                api_key,
                api_version,
                context: __classPrivateFieldGet(this, _a, "m", _Session_buildContext).call(this, context_data)
            };
            if (retrieve_innertube_config) {
                try {
                    Log.info(TAG, 'Retrieving InnerTube config data.');
                    const config_headers = {
                        'Accept-Language': lang,
                        'Accept': '*/*',
                        'Referer': Constants.URLS.YT_BASE,
                        'X-Goog-Visitor-Id': context_data.visitor_data,
                        'X-Origin': Constants.URLS.YT_BASE,
                        'X-Youtube-Client-Version': context_data.client_version
                    };
                    if (Platform.shim.server) {
                        config_headers['User-Agent'] = user_agent;
                        config_headers['Origin'] = Constants.URLS.YT_BASE;
                    }
                    const config = await fetch(`${Constants.URLS.API.PRODUCTION_1}v1/config?prettyPrint=false`, {
                        headers: config_headers,
                        method: 'POST',
                        body: JSON.stringify({ context: session_data.context })
                    });
                    const configJson = await config.json();
                    const coldConfigData = configJson.responseContext?.globalConfigGroup?.rawColdConfigGroup?.configData;
                    const coldHashData = configJson.responseContext?.globalConfigGroup?.coldHashData;
                    const hotHashData = configJson.responseContext?.globalConfigGroup?.hotHashData;
                    session_data.config_data = configJson.configData;
                    session_data.context.client.configInfo = {
                        ...session_data.context.client.configInfo,
                        coldConfigData,
                        coldHashData,
                        hotHashData
                    };
                }
                catch (error) {
                    Log.error(TAG, 'Failed to retrieve config data.', error);
                }
            }
            if (enable_session_cache)
                await __classPrivateFieldGet(this, _a, "m", _Session_storeSession).call(this, session_data, cache);
        }
        Log.debug(TAG, 'Session data:', session_data);
        return { ...session_data, account_index };
    }
    async signIn(credentials) {
        return new Promise(async (resolve, reject) => {
            const error_handler = (err) => reject(err);
            this.once('auth-error', error_handler);
            this.once('auth', () => {
                this.off('auth-error', error_handler);
                this.logged_in = true;
                resolve();
            });
            try {
                await this.oauth.init(credentials);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    /**
     * Signs out of the current account and revokes the credentials.
     */
    async signOut() {
        if (!this.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        const response = await this.oauth.revokeCredentials();
        this.logged_in = false;
        return response;
    }
    get client_version() {
        return this.context.client.clientVersion;
    }
    get client_name() {
        return this.context.client.clientName;
    }
    get lang() {
        return this.context.client.hl;
    }
}
_a = Session, _Session_storeSession = async function _Session_storeSession(session_data, cache) {
    if (!cache)
        return;
    Log.info(TAG, 'Compressing and caching session data.');
    const compressed_session_data = new TextEncoder().encode(LZW.compress(JSON.stringify(session_data)));
    const buffer = new ArrayBuffer(4 + compressed_session_data.byteLength);
    new DataView(buffer).setUint32(0, compressed_session_data.byteLength, true); // (Luan) XX: Leave this here for debugging purposes
    new Uint8Array(buffer).set(compressed_session_data, 4);
    await cache.set('innertube_session_data', new Uint8Array(buffer));
}, _Session_getSessionData = async function _Session_getSessionData(options, fetch = Platform.shim.fetch) {
    let visitor_id = generateRandomString(11);
    if (options.visitor_data)
        visitor_id = __classPrivateFieldGet(this, _a, "m", _Session_getVisitorID).call(this, options.visitor_data);
    const url = new URL('/sw.js_data', Constants.URLS.YT_BASE);
    const res = await fetch(url, {
        headers: {
            'Accept-Language': options.lang || 'en-US',
            'User-Agent': options.user_agent,
            'Accept': '*/*',
            'Referer': `${Constants.URLS.YT_BASE}/sw.js`,
            'Cookie': `PREF=tz=${options.time_zone.replace('/', '.')};VISITOR_INFO1_LIVE=${visitor_id};`
        }
    });
    if (!res.ok)
        throw new SessionError(`Failed to retrieve session data: ${res.status}`);
    const text = await res.text();
    if (!text.startsWith(')]}\''))
        throw new SessionError('Invalid JSPB response');
    const data = JSON.parse(text.replace(/^\)\]\}'/, ''));
    const ytcfg = data[0][2];
    const api_version = Constants.CLIENTS.WEB.API_VERSION;
    const [[device_info], api_key] = ytcfg;
    const config_info = device_info[61];
    const app_install_data = config_info[config_info.length - 1];
    const context_info = {
        hl: options.lang || device_info[0],
        gl: options.location || device_info[1],
        remote_host: device_info[3],
        visitor_data: options.visitor_data || device_info[13],
        user_agent: options.user_agent,
        client_name: options.client_name,
        client_version: Object.values(Constants.CLIENTS).filter((v) => v.NAME === options.client_name)[0]?.VERSION ?? device_info[16],
        os_name: device_info[17],
        os_version: device_info[18],
        time_zone: device_info[79] || options.time_zone,
        device_category: options.device_category,
        browser_name: device_info[86],
        browser_version: device_info[87],
        device_make: device_info[11],
        device_model: device_info[12],
        app_install_data: app_install_data,
        device_experiment_id: device_info[103],
        rollout_token: device_info[107],
        enable_safety_mode: options.enable_safety_mode
    };
    return { context_data: context_info, api_key, api_version };
}, _Session_buildContext = function _Session_buildContext(args) {
    const context = {
        client: {
            hl: args.hl || 'en',
            gl: args.gl || 'US',
            remoteHost: args.remote_host,
            screenDensityFloat: 1,
            screenHeightPoints: 1440,
            screenPixelDensity: 1,
            screenWidthPoints: 2560,
            visitorData: args.visitor_data,
            clientName: args.client_name,
            clientVersion: args.client_version,
            osName: args.os_name,
            osVersion: args.os_version,
            userAgent: args.user_agent,
            platform: args.device_category.toUpperCase(),
            clientFormFactor: 'UNKNOWN_FORM_FACTOR',
            userInterfaceTheme: 'USER_INTERFACE_THEME_LIGHT',
            timeZone: args.time_zone,
            originalUrl: Constants.URLS.YT_BASE,
            deviceMake: args.device_make,
            deviceModel: args.device_model,
            browserName: args.browser_name,
            browserVersion: args.browser_version,
            utcOffsetMinutes: -Math.floor((new Date()).getTimezoneOffset()),
            memoryTotalKbytes: '8000000',
            rolloutToken: args.rollout_token,
            deviceExperimentId: args.device_experiment_id,
            mainAppWebInfo: {
                graftUrl: Constants.URLS.YT_BASE,
                pwaInstallabilityStatus: 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
                webDisplayMode: 'WEB_DISPLAY_MODE_BROWSER',
                isWebNativeShareAvailable: true
            }
        },
        user: {
            enableSafetyMode: args.enable_safety_mode,
            lockedSafetyMode: false
        },
        request: {
            useSsl: true,
            internalExperimentFlags: []
        }
    };
    if (args.app_install_data)
        context.client.configInfo = { appInstallData: args.app_install_data };
    if (args.on_behalf_of_user)
        context.user.onBehalfOfUser = args.on_behalf_of_user;
    return context;
}, _Session_getVisitorID = function _Session_getVisitorID(visitor_data) {
    const decoded_visitor_data = ProtoUtils.decodeVisitorData(visitor_data);
    return decoded_visitor_data.id;
};
export default Session;
//# sourceMappingURL=Session.js.map