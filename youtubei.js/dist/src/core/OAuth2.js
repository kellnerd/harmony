var _OAuth2_instances, _OAuth2_session, _OAuth2_loadFromCache, _OAuth2_http_get;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { OAuth2Error, Platform } from '../utils/Utils.js';
import { Log, Constants } from '../utils/index.js';
const TAG = 'OAuth2';
class OAuth2 {
    constructor(session) {
        _OAuth2_instances.add(this);
        _OAuth2_session.set(this, void 0);
        __classPrivateFieldSet(this, _OAuth2_session, session, "f");
        this.YTTV_URL = new URL('/tv', Constants.URLS.YT_BASE);
        this.AUTH_SERVER_CODE_URL = new URL('/o/oauth2/device/code', Constants.URLS.YT_BASE);
        this.AUTH_SERVER_TOKEN_URL = new URL('/o/oauth2/token', Constants.URLS.YT_BASE);
        this.AUTH_SERVER_REVOKE_TOKEN_URL = new URL('/o/oauth2/revoke', Constants.URLS.YT_BASE);
    }
    async init(tokens) {
        if (tokens) {
            this.setTokens(tokens);
            if (this.shouldRefreshToken()) {
                await this.refreshAccessToken();
            }
            __classPrivateFieldGet(this, _OAuth2_session, "f").emit('auth', { credentials: this.oauth2_tokens });
            return;
        }
        const loaded_from_cache = await __classPrivateFieldGet(this, _OAuth2_instances, "m", _OAuth2_loadFromCache).call(this);
        if (loaded_from_cache) {
            Log.info(TAG, 'Loaded OAuth2 tokens from cache.', this.oauth2_tokens);
            return;
        }
        if (!this.client_id)
            this.client_id = await this.getClientID();
        // Initialize OAuth2 flow
        const device_and_user_code = await this.getDeviceAndUserCode();
        __classPrivateFieldGet(this, _OAuth2_session, "f").emit('auth-pending', device_and_user_code);
        this.pollForAccessToken(device_and_user_code);
    }
    setTokens(tokens) {
        const tokensMod = tokens;
        // Convert access token remaining lifetime to ISO string
        if (tokensMod.expires_in) {
            tokensMod.expiry_date = new Date(Date.now() + tokensMod.expires_in * 1000).toISOString();
            delete tokensMod.expires_in; // We don't need this anymore
        }
        if (!this.validateTokens(tokensMod))
            throw new OAuth2Error('Invalid tokens provided.');
        this.oauth2_tokens = tokensMod;
        if (tokensMod.client) {
            Log.info(TAG, 'Using provided client id and secret.');
            this.client_id = tokensMod.client;
        }
    }
    async cacheCredentials() {
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(this.oauth2_tokens));
        await __classPrivateFieldGet(this, _OAuth2_session, "f").cache?.set('youtubei_oauth_credentials', data.buffer);
    }
    async removeCache() {
        await __classPrivateFieldGet(this, _OAuth2_session, "f").cache?.remove('youtubei_oauth_credentials');
    }
    pollForAccessToken(device_and_user_code) {
        if (!this.client_id)
            throw new OAuth2Error('Client ID is missing.');
        const { device_code, interval } = device_and_user_code;
        const { client_id, client_secret } = this.client_id;
        const payload = {
            client_id,
            client_secret,
            code: device_code,
            grant_type: 'http://oauth.net/grant_type/device/1.0'
        };
        const connInterval = setInterval(async () => {
            const response = await __classPrivateFieldGet(this, _OAuth2_instances, "a", _OAuth2_http_get).fetch_function(this.AUTH_SERVER_TOKEN_URL, {
                body: JSON.stringify(payload),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const response_data = await response.json();
            if (response_data.error) {
                switch (response_data.error) {
                    case 'access_denied':
                        __classPrivateFieldGet(this, _OAuth2_session, "f").emit('auth-error', new OAuth2Error('Access was denied.', response_data));
                        clearInterval(connInterval);
                        break;
                    case 'expired_token':
                        __classPrivateFieldGet(this, _OAuth2_session, "f").emit('auth-error', new OAuth2Error('The device code has expired.', response_data));
                        clearInterval(connInterval);
                        break;
                    case 'authorization_pending':
                    case 'slow_down':
                        Log.info(TAG, 'Polling for access token...');
                        break;
                    default:
                        __classPrivateFieldGet(this, _OAuth2_session, "f").emit('auth-error', new OAuth2Error('Server returned an unexpected error.', response_data));
                        clearInterval(connInterval);
                        break;
                }
                return;
            }
            this.setTokens(response_data);
            __classPrivateFieldGet(this, _OAuth2_session, "f").emit('auth', { credentials: this.oauth2_tokens });
            clearInterval(connInterval);
        }, interval * 1000);
    }
    async revokeCredentials() {
        if (!this.oauth2_tokens)
            throw new OAuth2Error('Access token not found');
        await this.removeCache();
        const url = this.AUTH_SERVER_REVOKE_TOKEN_URL;
        url.searchParams.set('token', this.oauth2_tokens.access_token);
        return __classPrivateFieldGet(this, _OAuth2_session, "f").http.fetch_function(url, { method: 'POST' });
    }
    async refreshAccessToken() {
        if (!this.client_id)
            this.client_id = await this.getClientID();
        if (!this.oauth2_tokens)
            throw new OAuth2Error('No tokens available to refresh.');
        const { client_id, client_secret } = this.client_id;
        const { refresh_token } = this.oauth2_tokens;
        const payload = {
            client_id,
            client_secret,
            refresh_token,
            grant_type: 'refresh_token'
        };
        const response = await __classPrivateFieldGet(this, _OAuth2_instances, "a", _OAuth2_http_get).fetch_function(this.AUTH_SERVER_TOKEN_URL, {
            body: JSON.stringify(payload),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok)
            throw new OAuth2Error(`Failed to refresh access token: ${response.status}`);
        const response_data = await response.json();
        if (response_data.error_code)
            throw new OAuth2Error('Authorization server returned an error', response_data);
        this.oauth2_tokens.access_token = response_data.access_token;
        this.oauth2_tokens.expiry_date = new Date(Date.now() + response_data.expires_in * 1000).toISOString();
        __classPrivateFieldGet(this, _OAuth2_session, "f").emit('update-credentials', { credentials: this.oauth2_tokens });
    }
    async getDeviceAndUserCode() {
        if (!this.client_id)
            throw new OAuth2Error('Client ID is missing.');
        const { client_id } = this.client_id;
        const payload = {
            client_id,
            scope: 'http://gdata.youtube.com https://www.googleapis.com/auth/youtube-paid-content',
            device_id: Platform.shim.uuidv4(),
            device_model: 'ytlr::'
        };
        const response = await __classPrivateFieldGet(this, _OAuth2_instances, "a", _OAuth2_http_get).fetch_function(this.AUTH_SERVER_CODE_URL, {
            body: JSON.stringify(payload),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok)
            throw new OAuth2Error(`Failed to get device/user code: ${response.status}`);
        const response_data = await response.json();
        if (response_data.error_code)
            throw new OAuth2Error('Authorization server returned an error', response_data);
        return response_data;
    }
    async getClientID() {
        const yttv_response = await __classPrivateFieldGet(this, _OAuth2_instances, "a", _OAuth2_http_get).fetch_function(this.YTTV_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version',
                'Referer': 'https://www.youtube.com/tv',
                'Accept-Language': 'en-US'
            }
        });
        if (!yttv_response.ok)
            throw new OAuth2Error(`Failed to get client ID: ${yttv_response.status}`);
        const yttv_response_data = await yttv_response.text();
        let script_url_body;
        if ((script_url_body = Constants.OAUTH.REGEX.TV_SCRIPT.exec(yttv_response_data)) !== null) {
            Log.info(TAG, `Got YouTubeTV script URL (${script_url_body[1]})`);
            const script_response = await __classPrivateFieldGet(this, _OAuth2_instances, "a", _OAuth2_http_get).fetch(script_url_body[1], { baseURL: Constants.URLS.YT_BASE });
            if (!script_response.ok)
                throw new OAuth2Error(`TV script request failed with status code ${script_response.status}`);
            const script_response_data = await script_response.text();
            const client_identity = script_response_data
                .match(Constants.OAUTH.REGEX.CLIENT_IDENTITY);
            if (!client_identity || !client_identity.groups)
                throw new OAuth2Error('Could not obtain client ID.');
            const { client_id, client_secret } = client_identity.groups;
            Log.info(TAG, `Client identity retrieved (clientId=${client_id}, clientSecret=${client_secret}).`);
            return {
                client_id,
                client_secret
            };
        }
        throw new OAuth2Error('Could not obtain script URL.');
    }
    shouldRefreshToken() {
        if (!this.oauth2_tokens)
            return false;
        return Date.now() > new Date(this.oauth2_tokens.expiry_date).getTime();
    }
    validateTokens(tokens) {
        return !(!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date);
    }
}
_OAuth2_session = new WeakMap(), _OAuth2_instances = new WeakSet(), _OAuth2_loadFromCache = async function _OAuth2_loadFromCache() {
    const data = await __classPrivateFieldGet(this, _OAuth2_session, "f").cache?.get('youtubei_oauth_credentials');
    if (!data)
        return false;
    const decoder = new TextDecoder();
    const credentials = JSON.parse(decoder.decode(data));
    this.setTokens(credentials);
    __classPrivateFieldGet(this, _OAuth2_session, "f").emit('auth', { credentials });
    return true;
}, _OAuth2_http_get = function _OAuth2_http_get() {
    return __classPrivateFieldGet(this, _OAuth2_session, "f").http;
};
export default OAuth2;
//# sourceMappingURL=OAuth2.js.map