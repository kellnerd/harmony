import { OAuth2Error } from '../utils/Utils.js';
import type Session from './Session.js';
export type OAuth2ClientID = {
    client_id: string;
    client_secret: string;
};
export type OAuth2Tokens = {
    access_token: string;
    expiry_date: string;
    expires_in?: number;
    refresh_token: string;
    scope?: string;
    token_type?: string;
    client?: OAuth2ClientID;
};
export type DeviceAndUserCode = {
    device_code: string;
    expires_in: number;
    interval: number;
    user_code: string;
    verification_url: string;
    error_code?: string;
};
export type OAuth2AuthEventHandler = (data: {
    credentials: OAuth2Tokens;
}) => void;
export type OAuth2AuthPendingEventHandler = (data: DeviceAndUserCode) => void;
export type OAuth2AuthErrorEventHandler = (err: OAuth2Error) => void;
export default class OAuth2 {
    #private;
    YTTV_URL: URL;
    AUTH_SERVER_CODE_URL: URL;
    AUTH_SERVER_TOKEN_URL: URL;
    AUTH_SERVER_REVOKE_TOKEN_URL: URL;
    client_id: OAuth2ClientID | undefined;
    oauth2_tokens: OAuth2Tokens | undefined;
    constructor(session: Session);
    init(tokens?: OAuth2Tokens): Promise<void>;
    setTokens(tokens: OAuth2Tokens): void;
    cacheCredentials(): Promise<void>;
    removeCache(): Promise<void>;
    pollForAccessToken(device_and_user_code: DeviceAndUserCode): void;
    revokeCredentials(): Promise<Response | undefined>;
    refreshAccessToken(): Promise<void>;
    getDeviceAndUserCode(): Promise<DeviceAndUserCode>;
    getClientID(): Promise<OAuth2ClientID>;
    shouldRefreshToken(): boolean;
    validateTokens(tokens: OAuth2Tokens): boolean;
}
