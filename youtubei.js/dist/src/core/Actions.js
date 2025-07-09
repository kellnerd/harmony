var _Actions_instances, _Actions_isBrowse, _Actions_needsLogin;
import { __classPrivateFieldGet } from "tslib";
import { NavigateAction, Parser } from '../parser/index.js';
import { InnertubeError } from '../utils/Utils.js';
class Actions {
    constructor(session) {
        _Actions_instances.add(this);
        this.session = session;
    }
    /**
     * Makes calls to the playback tracking API.
     * @param url - The URL to call.
     * @param client - The client to use.
     * @param params - Call parameters.
     */
    async stats(url, client, params) {
        const s_url = new URL(url);
        s_url.searchParams.set('ver', '2');
        s_url.searchParams.set('c', client.client_name.toLowerCase());
        s_url.searchParams.set('cbrver', client.client_version);
        s_url.searchParams.set('cver', client.client_version);
        for (const key of Object.keys(params)) {
            s_url.searchParams.set(key, params[key]);
        }
        return await this.session.http.fetch(s_url);
    }
    async execute(endpoint, args) {
        let data;
        if (args && !args.protobuf) {
            data = { ...args };
            if (Reflect.has(data, 'browseId') && !args.skip_auth_check) {
                if (__classPrivateFieldGet(this, _Actions_instances, "m", _Actions_needsLogin).call(this, data.browseId) && !this.session.logged_in)
                    throw new InnertubeError('You must be signed in to perform this operation.');
            }
            if (Reflect.has(data, 'skip_auth_check'))
                delete data.skip_auth_check;
            if (Reflect.has(data, 'override_endpoint'))
                delete data.override_endpoint;
            if (Reflect.has(data, 'parse'))
                delete data.parse;
            if (Reflect.has(data, 'request'))
                delete data.request;
            if (Reflect.has(data, 'clientActions'))
                delete data.clientActions;
            if (Reflect.has(data, 'settingItemIdForClient'))
                delete data.settingItemIdForClient;
            if (Reflect.has(data, 'action')) {
                data.actions = [data.action];
                delete data.action;
            }
            if (Reflect.has(data, 'boolValue')) {
                data.newValue = { boolValue: data.boolValue };
                delete data.boolValue;
            }
            if (Reflect.has(data, 'token')) {
                data.continuation = data.token;
                delete data.token;
            }
            if (data?.client === 'YTMUSIC') {
                data.isAudioOnly = true;
            }
        }
        else if (args) {
            data = args.serialized_data;
        }
        const target_endpoint = Reflect.has(args || {}, 'override_endpoint') ? args?.override_endpoint : endpoint;
        const response = await this.session.http.fetch(target_endpoint, {
            method: 'POST',
            body: args?.protobuf ? data : JSON.stringify((data || {})),
            headers: {
                'Content-Type': args?.protobuf ?
                    'application/x-protobuf' :
                    'application/json'
            }
        });
        if (args?.parse) {
            let parsed_response = Parser.parseResponse(await response.json());
            // Handle redirects
            if (__classPrivateFieldGet(this, _Actions_instances, "m", _Actions_isBrowse).call(this, parsed_response) && parsed_response.on_response_received_actions?.[0]?.type === 'navigateAction') {
                const navigate_action = parsed_response.on_response_received_actions.firstOfType(NavigateAction);
                if (navigate_action) {
                    parsed_response = await navigate_action.endpoint.call(this, { parse: true });
                }
            }
            return parsed_response;
        }
        // Mimics the Axios API using Fetch's Response object.
        return {
            success: response.ok,
            status_code: response.status,
            data: await response.json()
        };
    }
}
_Actions_instances = new WeakSet(), _Actions_isBrowse = function _Actions_isBrowse(response) {
    return 'on_response_received_actions' in response;
}, _Actions_needsLogin = function _Actions_needsLogin(id) {
    return [
        'FElibrary',
        'FEhistory',
        'FEsubscriptions',
        'FEchannels',
        'FEplaylist_aggregation',
        'FEmusic_listening_review',
        'FEmusic_library_landing',
        'SPaccount_overview',
        'SPaccount_notifications',
        'SPaccount_privacy',
        'SPtime_watched'
    ].includes(id);
};
export default Actions;
//# sourceMappingURL=Actions.js.map